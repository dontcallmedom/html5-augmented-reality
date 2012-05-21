jQuery(document).ready(function ($) {
 var cameraOutput = document.getElementById("camera");
 function gotCameraStream(stream) {
     cameraOutput.src = stream;
     cameraOutput.play();     
 }

 function errorWithCamera(error) {
     $("#error").html(error);
 }

 navigator.getUserMedia({video:true}, gotCameraStream, errorWithCamera);

 window.addEventListener("deviceorientation", function(e) {
   $("#orientation").html(e.alpha);
 });
});