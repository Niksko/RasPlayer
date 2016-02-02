/*
 * Set up the routes required for serving files
 * This module exports a function that takes the app variable to be used for the routes
 */

module.exports = function(app) {

  // Set up a route for the index
  app.get('/public/directory-style.css', function(req, res){
    res.sendFile(__dirname + '/public/directory-style.css');
  });

  // Set up a route for the index
  app.get('/public/directory.js', function(req, res){
    res.sendFile(__dirname + '/public/directory.js');
  });

  // Set up a route for jquery
  app.get('/jquery.js', function(req, res){
    res.sendFile(__dirname + '/bower_components/jquery/dist/jquery.min.js');
  });

};
