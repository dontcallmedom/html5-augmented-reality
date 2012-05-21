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
 var ctx = document.getElementById("overlay").getContext("2d");
 ctx.fillStyle = "white";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.strokeStyle = "black";  
 ctx.font="15px Arial";
 window.addEventListener("deviceorientation", function(e) {
   $("#orientation").html(e.alpha);
   ctx.clearRect(0,0,320,240);
   ctx.fillText("South",160 + ((e.alpha - 180) % 360)*16/9,120);
   ctx.fillText("North",160 + (e.alpha % 360)*16/9,120);
   ctx.fillText("East",160 + ((e.alpha - 90) % 360)*16/9,120);
   ctx.fillText("West",160 + ((e.alpha - 270) % 360)*16/9,120);
 });
});