/*
 * Imports
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var omx = require('omxdirector');
omx.play('bird.avi');
