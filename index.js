/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveIndex = require('serve-index');
const fs = require('fs');
const child_process = require('child_process');

var omx = require('omxdirector').enableNativeLoop();

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
  });

  // Listen for status requests
  socket.on('get-status', function(){
    sendStatus(omx, socket);
  });

  // Listen for play requests
  socket.on('play', function(response){
    // Get the player status
    var statusResponse = omx.getStatus();
    // Create a background image with the correct color and size
    var execString = 'convert -size 1920x1080 xc:' + response.bgcol + ' bg.png';
    child_process.execSync(execString);
    // Throw up this background image into a new feh process
    socket.feh = child_process.spawn('feh', ['-F', 'x', '--hide-pointer', '-Z', 'bg.png']);
    // If either we're playing or we're stopped
    if (statusResponse.loaded === false || statusResponse.playing === true){
      // Set the video directory based on the folder from the response object
      omx.setVideoDir(response.folder);
      // Interpret the delay
      var delayTime = parseInt(response.delay);
      if (isNaN(delayTime)){
        delayTime = 0;
      };
      // We need to manually trigger each video by attaching a stop listener, which then triggers a delay
      // For this we need to add a response parameter and a currentVideo parameter
      omx.response = response;
      omx.currentVideo = 0;
      // Manually play the videos using the delay
      manualPlay(omx);
      }
    }
    // We're paused, so just unpause
    else {
      omx.play();
    };
  });


  // Listen for stop requests
  socket.on('stop', function(){
    // Remove any other stop listeners that were added by the manual player
    omx.removeListener('stop', stopTimer);
    // Stop omx
    omx.stop();
    // Kill feh
    socket.feh.kill('SIGHUP');
  });

  // Listen for pause requests
  socket.on('pause', function(){
    omx.pause();
  });

  // Listen for play, pause and stop actions on the omx and send status updates to the frontend
  omx.on('play', function(){
    sendStatus(omx, socket);
  });
  omx.on('stop', function(){
    sendStatus(omx, socket);
  });
  omx.on('pause', function(){
    sendStatus(omx, socket);
  });
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});

function sendStatus(omx, socket) {
    // Get status and respond via socket
    var response = omx.getStatus();
    socket.emit('status', response);
};

function manualPlay(omx) {
  // Play the video
  omx.play(omx.response.playlist[omx.currentVideo], {audioOutput: omx.response.audioOutput});
  // Update the current video
  omx.currentVideo = omx.currentVideo + 1;
  if (omx.currentVideo <= omx.response.playlist.length || omx.response.loop){
    // Add a listener for the omx stop
    omx.once('stop', stopTimer);
  };
  if (omx.currentVideo <= omx.response.playlist.length && omx.response.loop){
    omx.currentVideo = 0;
  };
};
