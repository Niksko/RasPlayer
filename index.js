/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveIndex = require('serve-index');
const fs = require('fs');

var omx = require('omxdirector');

// Add all of our routes
require('./routes.js')(app);

// Serve folders from the file structure using serveIndex
app.use('/filesystem', serveIndex('/', {'icons': true,
                              'template': 'public/directory.html'}));

io.on('connection', function (socket){
  console.log('client connected');

  // Listen for file grab messages
  socket.on('get-files', function(folder){
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
        socket.emit('file-list', fileArray);
      };
    });
  });
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});
