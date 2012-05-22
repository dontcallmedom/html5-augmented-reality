jQuery(document).ready(function ($) {
 var cameraOutput = document.getElementById("camera");
 var poi = [];
 var maxDistance = 0;
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
           maxDistance = Math.max(maxDistance, p.distance);
	   poi.push(p);
       }
   for (var i =0 ; i<poi.length; i++) {
     console.log(poi[i].distance + " " + maxDistance);
     console.log( (poi[i].distance/maxDistance) * (240-15));
   }
     });
 }
 if (navigator.getUserMedia) {
    navigator.getUserMedia({video:true}, gotCameraStream, errorWithCamera);     
 }
 navigator.geolocation.getCurrentPosition(gotPosition);
 var ctx = document.getElementById("overlay").getContext("2d");
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.font="15px Arial";
 function setOrientation(alpha) {
   $("#orientation").html(alpha);
   ctx.clearRect(0,0,320,240);
   for (var i =0 ; i<poi.length; i++) {
     //ctx.fillStyle= "rgba(0,0,0,0.5)";
     //ctx.fillRect(0,100,320,40);
     ctx.fillStyle = "white";
     console.log(poi[i].distance + " " + maxDistance);
     // Based on direction of POI
     var x = 160 + ((360 + alpha - poi[i].angle) % 360)*16/9;
     // Put text based on logarithmic scale of distance
     var y = 240 - Math.log(poi[i].distance) / Math.log(Math.pow(maxDistance, 1/ (240-15)));
     ctx.beginPath();
     ctx.moveTo(160,260);
     ctx.lineTo(x,y);
     ctx.strokeStyle = "white";
     ctx.stroke();
     ctx.font="10px Arial";
     ctx.fillText(Math.floor(poi[i].distance / 100) / 10 + 'km',160 + (x - 160) / 2, 240 + (y - 240)/2);
     ctx.font="15px Arial";
     ctx.fillText(poi[i].label,x,y);
   }
 }
    setOrientation(180);
 window.addEventListener("deviceorientation", function(e) {
     setOrientation(e.alpha);
 });
});