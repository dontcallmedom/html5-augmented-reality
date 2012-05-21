jQuery(document).ready(function ($) {
 var cameraOutput = document.getElementById("camera");
 var poi = [];
 function gotCameraStream(stream) {
     cameraOutput.src = stream;
     cameraOutput.play();     
 }

 function errorWithCamera(error) {
     $("#error").html(error);
 }

 function gotPosition(pos) {
     var here = {"latitude":pos.coords.latitude,"longitude":pos.coords.longitude};
     $.getJSON("data.json", function(data) {
       for (var i = 0 ; i < data.length; i++) {
	   poi.push(projectedPOI(here,data[i]));
       }
     });

 }
 navigator.getUserMedia({video:true}, gotCameraStream, errorWithCamera);
 navigator.getCurrentPosition(gotPosition);
 var ctx = document.getElementById("overlay").getContext("2d");
 ctx.fillStyle= "rgba(0,0,0,0.5)";
 ctx.fillRect(0,100,320,40);
 ctx.fillStyle = "rgba(255,255,255,255)";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.strokeStyle = "black";  
 ctx.font="15px Arial";
 window.addEventListener("deviceorientation", function(e) {
   $("#orientation").html(e.alpha);
   ctx.clearRect(0,100,320,140);
   ctx.fillStyle= "rgba(0,0,0,0.5)";
   ctx.fillRect(0,100,320,40);
   ctx.fillStyle = "rgba(255,255,255,255)";
   for (var i =0 ; i<poi.length; i++) {
     ctx.fillText("South",160 + ((e.alpha - 180) % 360)*16/9,120);
     ctx.fillText("North",160 + (e.alpha % 360)*16/9,120);
     ctx.fillText("East",160 + ((e.alpha - 90) % 360)*16/9,120);
     ctx.fillText("West",160 + ((e.alpha - 270) % 360)*16/9,120);       
   }
 });
});