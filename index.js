/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveIndex = require('serve-index');

var omx = require('omxdirector');

app.use('/', serveIndex('/files', {'icons': true}));
http.listen(3000);
