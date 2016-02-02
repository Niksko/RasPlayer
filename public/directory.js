$(document).ready(function() {
  // If the select button is clicked, redirect with query string
  $("button.select").click(function(){
    // Note we are selecting the final link in the header and extracting it's link location
    var folder = encodeURIComponent($("h1 a:last-child").attr('href'));
    window.location.replace("/index.html?folder=" + folder);
  });
});
