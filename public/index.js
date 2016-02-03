$(document).ready(function(){

  // Connect to backend socket 
  var socket = io();

  // Get the status of the video player from the backend
  socket.emit('get-status');

  // Handle the status response
  socket.on('status', function(response){
    // If the player is not loaded
    if (response.loaded === false) {
      // Disable the stop and pause buttons
      $("button#pause").addClass('disabled');
      $("button#stop").addClass('disabled');
    }
    else if (response.playing === true) {
      // Disable the play button, enable stop and pause
      $("button#play").addClass('disabled');
      $("button#pause").removeClass('disabled');
      $("button#stop").removeClass('disabled');

      // Ensure the loop checkbox reflects the current state
      if (response.options.loop === true){
        $("#loop-checkbox").prop('checked', true);
      }
      else {
        $("#loop-checkbox").prop('checked', false);
      };

      // Get the list of videos and populate the 'now playing' list
      //
      // First, empty the list
      $("div#now-playing ul").empty();
      // Now add a li for each of the videos currently playing
      for (var i=0; i < response.videos.length; i++){
        var $listItem = $("<li>").text(response.videos[i]);
        $("div#now-playing ul").append($listItem);
      }
    }
    else {
      // response.playing must be false
      // Enable the play button, disable pause and stop
      $("button#play").removeClass('disabled');
      $("button#pause").addClass('disabled');
      $("button#stop").addClass('disabled');
    };
  });

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

  // Extract the folder from the query string and set the folder box based on this
  var folder = getQueryVariable('folder');
  $("input#folder").val(folder);

  // Add a handler for the button which requests the folder list
  $("button#file-list").click(function(){
    socket.emit('get-files', folder);

    // Handle the response from the server with the file list
    socket.on('file-list', function(fileArray){
      // Remove all elements from the list
      $("div#file-list ul").empty();
      // Create the required li entries for files in the list
      for (var i=0; i < fileArray.length; i++) {
        var $listItem = "<li class='ui-state-default'>" + fileArray[i]+ "</li>"
        var $listItem = $("<li>", {class: 'ui-state-default'}).text(fileArray[i]);
        $("div#file-list ul").append($listItem);
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
  });

  // Add a handler for the folder select button to take you to the folder browser
  $("button#folder-select").click(function(){
    window.location.replace("/filesystem");
  });
});
