$(document).ready(function(){
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

  var folder = getQueryVariable('folder');
  console.log(folder);
  $("h1").text(folder);
});
