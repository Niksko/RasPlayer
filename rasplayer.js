/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveIndex = require('serve-index');
const fs = require('fs');

var OmxManager = require('omx-manager');
var omx = new OmxManager();
// Use this variable as a storage point for the active video
var player = null;

// Add all of our routes
require('./routes.js')(app);

// Serve folders from the file structure using serveIndex
app.use('/filesystem', serveIndex('/', {'icons': true,
                              'template': 'public/filesystem-browser.html'}));

var stopTimer = function() {
  setTimeout(manualPlay, parseInt(omx.response.delay) * 1000, omx);
};

io.on('connection', function (socket){
  console.log('client connected');

  // Listen for file grab messages
  socket.on('get-files', function(folder){
    // If the folder is not null
    if (folder !== null) {
      // Fetch the file list
      var fileList = fs.readdir(folder, function(err, files){
        if (err){
          console.log(err);
        }
        else {
          // Create a new array with only the files (not directories) in the directory
          var fileArray = [];
          files.forEach(function(item){
            if (fs.lstatSync(folder + "/" + item).isFile() === true){
              fileArray.push(item);
            }
          });
          // Send these back to the frontend
          socket.emit('file-list', fileArray);
        };
      });
    };
  });

  // Listen for status requests
  socket.on('get-status', function(){
    sendStatus(player, socket);
  });

  // Listen for play requests
  socket.on('play', function(response){
    // Get the player status
    var statusResponse = {};
    if (player != null) {
      statusResponse = player.getStatus();
    }
    // If either we're playing or we're stopped
    if (player === null || statusResponse.playing === false){
      // Set the video directory based on the folder from the response object
      if (response.folder.startsWith("/")) {
        omx.setVideosDirectory(response.folder);
      }
      // Interpret the delay
      var delayTime = parseInt(response.delay);
      if (isNaN(delayTime)){
        delayTime = 0;
      };
      // We need to manually trigger each video by attaching a stop listener, which then triggers a delay
      // For this we need to add a response parameter and a nextVideo parameter
      omx.response = response;
      omx.nextVideo = 0;
      // Manually play the videos using the delay
      manualPlay(omx);
    }
    // We're paused, so just unpause
    else {
      player.play();
    };
  });

  // Listen for stop requests
  socket.on('stop', function(){
    // Remove any other stop listeners that were added by the manual player
    omx.removeListener('stop', stopTimer);
    // Stop omx
    player.stop();
  });

  socket.on('shutdown', function(){
    // Stop the omxplayer and exit the node instance after two seconds, just to allow time to serve the shutdown page
    setTimeout(function (){
      player.stop();
      process.exit();
    }, 2000);
  });

  // Listen for pause requests
  socket.on('pause', function(){
    omx.pause();
  });

  // Listen for play, pause and stop actions on the omx and send status updates to the frontend
  omx.on('play', function(){
    sendStatus(player, socket);
  });
  omx.on('stop', function(){
    sendStatus(player, socket);
  });
  omx.on('pause', function(){
    sendStatus(player, socket);
  });
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});

function sendStatus(camera, socket) {
    var response = {}
    // Get status and respond via socket
    if (camera != null) {
      var response = camera.getStatus();
    }
    // Correct the loop status depending on the internal omx loop status obtained from the frontend (if it exists)
    if (omx.response !== undefined && response.settings !== undefined){
      response.loop = omx.response.loop;
    };
    socket.emit('status', response);
};

function manualPlay(omx) {
  // Play the video
  player = omx.create(omx.response.playlist[omx.nextVideo], {'-o': omx.response.audioOutput, '--display': 5, '-b': true});
  player.play();
  // Update the current video
  omx.nextVideo = omx.nextVideo + 1;
  // If we're looping or we haven't reached the end of the list of videos
  if (omx.nextVideo < omx.response.playlist.length || omx.response.loop){
    // Add a listener for the omx stop
    omx.once('stop', stopTimer);
  };
  // If we've gotten to the end of the list of videos and we need to loop, set the next video back to zero
  if (omx.nextVideo >= omx.response.playlist.length && omx.response.loop){
    omx.nextVideo = 0;
  };
};
