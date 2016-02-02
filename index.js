/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveIndex = require('serve-index');

var omx = require('omxdirector');

// Add all of our routes
require('./routes.js')(app);

// Serve folders from the file structure using serveIndex
app.use('/', serveIndex('/', {'icons': true,
                              'template': 'public/directory.html'}));

// Listen for folder selects and log them
io.on('connection', function(socket){
  socket.on('folder-select', function(data){
    console.log('got folder select');
    console.log('data ' + data);
  });
});

http.listen(3000);
