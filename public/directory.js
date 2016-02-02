$(document).ready(function() {
  // Set up the socket.io object
  var socket = io();

  // If the select button is clicked, fire an event containing the current directory
  $("button.select").click(function(){
    // Note we are selecting the final link in the header and extracting it's link location
    socket.emit('folder-select', $("h1 a:last-child").attr('href'));
  });
});
