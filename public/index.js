$(document).ready(function(){
  // Obtain socket
  var socket = io();

  // Make the ul sortable
  $( "#sortable" ).sortable({
    items: "li:not(.ui-state-disabled)"
  });
  $( "#sortable li" ).disableSelection();

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
    socket.emit('get-files', folder);
  });

  // Handle the response from the server with the file list
  socket.on('file-list', function(fileArray){
    // Remove all elements from the list
    $("div#file-list ul").empty();
    // Create the required li entries for files in the list
    for (var i=0; i < fileArray.length; i++) {
      var listItem = "<li class='ui-state-default'>" + fileArray[i]+ "</li>"
      $("div#file-list ul").append(listItem);
    };

    // Allow the clicking on the list items to toggle whether they are sortable
    $("div#file-list ul li").click(function(){
      $(this).toggleClass('ui-state-disabled');

      // Make the ul sortable based on new disable items
      $( "#sortable" ).sortable({
        items: "li:not(.ui-state-disabled)"
      });
      $( "#sortable li" ).disableSelection();
    });
  });

  // Add a handler for the folder select button to take you to the folder browser
  $("button#folder-select").click(function(){
    window.location.replace("/");
  });
});
