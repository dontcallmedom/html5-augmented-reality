jQuery(document).ready(function ($) {
 var cameraOutput = document.getElementById("camera");
 function gotCameraStream(stream) {
     cameraOutput.src = stream;
     cameraOutput.play();     
 }

 function errorWithCamera(error) {
     $("#error").html(error);
 }
   // create a K3D object for rendering
   var obj = new K3D.K3DObject();
   with (obj)
   {
      color = [255,0,0];      // colour used for wireframe edges and depthcued rendering mode
      drawmode = "solid"; // one of "point", "wireframe", "solid"
      shademode = "plain";  // one of "plain", "depthcue", "lightsource" (solid drawing mode only)
      scale = 50;
      init(
         // describe the points of a simple unit cube
         [{x:-1,y:1,z:-1}, {x:1,y:1,z:-1}, {x:1,y:-1,z:-1}, {x:-1,y:-1,z:-1},
          {x:-1,y:1,z:1}, {x:1,y:1,z:1}, {x:1,y:-1,z:1}, {x:-1,y:-1,z:1}],
         // describe the edges of the cube
         [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0},
          {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4},
          {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
         // describe the polygon faces of the cube
         [{color:[255,0,0],vertices:[0,1,2,3]},{color:[0,255,0],vertices:[0,4,5,1]},
          {color:[0,0,255],vertices:[1,5,6,2]},{color:[255,255,0],vertices:[2,6,7,3]},
          {color:[0,255,255],vertices:[3,7,4,0]},{color:[255,0,255],vertices:[7,6,5,4]}]
      );
   }
var k3d = new K3D.Controller(document.getElementById("overlay"));
  k3d.addK3DObject(obj);
  k3d.paused = false; // begin the rendering and animation immediately
  k3d.frame(); // render a frame before returning
  k3d.fps = 30; // request 30 frames per second animation from the controller

 navigator.getUserMedia({video:true}, gotCameraStream, errorWithCamera);

 window.addEventListener("deviceorientation", function(e) {
   $("#orientation").html(e.alpha);
   obj.ophi = e.alpha;
   obj.otheta = e.beta;
 });
});