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
     $.getJSON("js/data.json", function(data) {
       for (var i = 0 ; i < data.length; i++) {
	   var p = projectedPOI(here,data[i]);
           console.log(p);
	   poi.push(p);
       }
     });

 }
 if (navigator.getUserMedia) {
    navigator.getUserMedia({video:true}, gotCameraStream, errorWithCamera);     
 }
 navigator.geolocation.getCurrentPosition(gotPosition);
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
     ctx.fillText(poi[i].label,160 + ((e.alpha - poi[i].angle) % 360)*16/9,120);
   }
 });
});