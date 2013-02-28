jQuery(document).ready(function ($) {
 var cameraOutput = document.getElementById("camera");
 var poi = [];
 var maxDistance = 0;
 function gotCameraStream(stream) {
      var source;
     if (window.webkitURL) {
	 source = window.webkitURL.createObjectURL(stream);
     } else {
	 source = stream; 
     }
     if (video.mozCaptureStream) {
	 cameraOutput.mozSrcObject = source;
     } else {
	 cameraOutput.src = source;
     }
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
	   // Let's calculate the position on our overlay canvas
           // based on logarithmic scale of distance
	   poi[i].y = 240 - Math.log(poi[i].distance) / Math.log(Math.pow(maxDistance, 1/ (240-15)));
       }
       setOrientation(180);
     });
 }

 navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia ||
navigator.webkitGetUserMedia || navigator.msGetUserMedia);

 if (navigator.getUserMedia) {
    navigator.getUserMedia({video:true, toString: function(){return 'video';}}, gotCameraStream, errorWithCamera);     
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
     ctx.fillStyle = "white";
     // Based on direction of POI
     var x = 160 + ((360 + alpha - poi[i].angle) % 360)*16/9;

     var y = poi[i].y;
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
    count = 0;
 window.addEventListener("deviceorientation", function(e) {
     if (count % 40) {
       setOrientation(e.alpha);
     }
     count ++ ;
 });
});