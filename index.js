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

io.on('connection', function (socket){
  console.log('client connected');
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});
