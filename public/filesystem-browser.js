$(document).ready(function() {
  // If the select button is clicked, redirect with query string
  $("#select").click(function(){
    // Get the current folder location based on the link associated with the breadcrumbs at the top of the page
    var folderLink = $("#breadcrumbs a:last-child").attr('href');
    // Strip the opening part of the url because this is just based on the web route
    var folderPath = folderLink.replace('/filesystem', '');
    var folderQueryString = encodeURIComponent(folderPath);
    window.location.replace("/?folder=" + folderQueryString);
  });
});
