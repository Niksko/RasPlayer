/*
 * Set up the routes required for serving files
 * This module exports a function that takes the app variable to be used for the routes
 */

module.exports = function(app) {

  // Set up a route for the index
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });

  // Set up a route for the index js
  app.get('/public/index.js', function(req, res){
    res.sendFile(__dirname + '/public/index.js');
  });

  // Set up a route for the index css
  app.get('/public/index.css', function(req, res){
    res.sendFile(__dirname + '/public/index.css');
  });

  // Set up a route for the directory browser style
  app.get('/public/filesystem-browser.css', function(req, res){
    res.sendFile(__dirname + '/public/filesystem-browser.css');
  });

  // Set up a route for the directory browser js
  app.get('/public/filesystem-browser.js', function(req, res){
    res.sendFile(__dirname + '/public/filesystem-browser.js');
  });

  // Set up a route for jquery
  app.get('/jquery.js', function(req, res){
    res.sendFile(__dirname + '/bower_components/jquery/dist/jquery.min.js');
  });

  // Set up a route for jquery
  app.get('/jquery-ui.js', function(req, res){
    res.sendFile(__dirname + '/bower_components/jquery-ui/jquery-ui.min.js');
  });

  // Set up a route for pure
  app.get('/pure-min.css', function(req, res){
    res.sendFile(__dirname + '/bower_components/pure/pure-min.css');
  });

};
