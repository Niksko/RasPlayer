$(document).ready(function(){
  // Obtain socket
  var socket = io();

  // Function for extracting query variables from the url
  // Taken from https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      console.log('Query variable %s not found', variable);
  };

  // Extract the folder from the query string and set the h1 text based on it's value
  var folder = getQueryVariable('folder');
  $("input#folder").val(folder);

  // Add a handler for the button which requests the folder list
  $("button#file-list").click(function(){
    socket.emit('get-files');
  });

  // Handle the response from the server with the file list
  socket.on('file-list', function(fileArray){
    // Remove all elements from the list
    $("div#file-list ul").empty();
    // Create the required li entries for files in the list
    for (el in fileArray) {
      var listItem = "<li class='ui-state-default'>" + el + "</li>"
      $("div#file-list ul").append(listItem);
    };
  });

  // Add a handler for the folder select button to take you to the folder browser
  $("button#folder-select").click(function(){
    window.location.replace("/");
  });
});
