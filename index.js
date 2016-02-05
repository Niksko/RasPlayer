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
      // Start playing
      omx.play(response.playlist, {loop: response.loop, audioOutput: response.audioOutput});
    }
    // We're paused, so just unpause
    else {
      omx.play();
    };
  });

  // Listen for stop requests
  socket.on('stop', function(){
    // Stop omx
    omx.stop();
    // Kill feh
    socket.feh.kill();
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
}
