var AugmentedRealityViewer = function(getPOI, options) {
    var self = this;
    this.poi = [];
    var maxDistance = 0, here, overlay, ctx;
    this.viewer;
    
    this.setViewer = function (element) {
	this.viewer = element;
	this.viewer.width = element.offsetWidth;
	this.viewer.height = element.offsetHeight;
	this.viewer.style.backgroundColor = "black";
	var container = document.createElement("div");
	container.style.position = "relative";
	container.style.marginTop = container.style.marginBottom = container.style.marginLeft = container.style.marginRight = container.style.paddingTop = container.style.paddingBottom = container.style.paddingLeft = container.style.paddingRight = 0;

	overlay = document.createElement("canvas");
	overlay.width = this.viewer.width;
	overlay.height = this.viewer.height;
	overlay.style.position = 'absolute';
	overlay.style.top = overlay.style.left = 0;
	element.parentNode.replaceChild(container, element);
	container.appendChild(this.viewer);
	container.appendChild(overlay);
	ctx = overlay.getContext("2d");
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font="15px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
    };

    var alpha = null,  prevAlpha = null;


    this.addStream = function (stream) {
	var source;
	if (window.webkitURL) {
	    source = window.webkitURL.createObjectURL(stream);
	    self.viewer.autoplay = true;
	} else {
	    source = stream; 
	}
	if (self.viewer.mozSrcObject !== undefined) {
	    self.viewer.mozSrcObject = source;
	} else {
	    self.viewer.src = source;
	}
	self.viewer.play();     
	setPOIy();
    };

    function distance(pos1, pos2) {
	function toRad(n) {
	    return n * Math.PI / 180;
	}
	var R = 6371000; // m
	var dLat = toRad(pos2.latitude-pos1.latitude);
	var dLon = toRad(pos2.longitude - pos1.longitude);
	var lat1 = toRad(pos1.latitude);
	var lat2 = toRad(pos2.latitude);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;    
	return d;
    }

    function projectedPOI(here,obj) {
	var d = distance(here,obj);
	var objNorth = {latitude:obj.latitude,longitude:here.longitude};
	var dNorth = (here.latitude > obj.latitude ? - 1 : 1) * distance(here, objNorth);
	var angle = (360 + (here.longitude > obj.longitude ? -1 : 1) * Math.acos(dNorth/d) * 180 / Math.PI) % 360;
	return {distance:d, angle:angle, label:obj.label};
    }
    
    this.setPosition = function (pos) {
	here = {"latitude":pos.coords.latitude,"longitude":pos.coords.longitude};
	getPOI(here, function (data) {
	    for (var i = 0 ; i < data.length; i++) {
		var p = projectedPOI(here,data[i]);
		maxDistance = Math.max(maxDistance, p.distance);
		self.poi.push(p);
	    }
	    setPOIy();
	});
    };

    this.setOrientation = function (newalpha) {
	alpha = newalpha;
    }

    function setPOIy() {
	if (here && self.viewer) {
	    for (var i =0 ; i<self.poi.length; i++) {
		// Let's calculate the position on our overlay canvas
		// based on logarithmic scale of distance
		self.poi[i].y = overlay.height - Math.log(self.poi[i].distance) / Math.log(Math.pow(maxDistance, 1/ (overlay.height-15)));
	    }
	    drawPOIInfo();
	}
    }


    var animation;
    function drawPOIInfo() {
	if (prevAlpha === null || Math.abs(alpha - prevAlpha) > 1) {
	    prevAlpha = alpha;
	    ctx.clearRect(0,0,overlay.width,overlay.height);
	    for (var i =0 ; i<self.poi.length; i++) {
		// Based on direction of POI
		var x = overlay.width / 2 + ((360 + alpha - self.poi[i].angle) % 360)*16/9;
		
		var y = self.poi[i].y;
		ctx.beginPath();
		ctx.moveTo(overlay.width / 2, overlay.height * 1.1);
		ctx.lineTo(x,y);
		ctx.stroke();
		ctx.font="10px Arial";
		ctx.fillText(Math.floor(self.poi[i].distance / 100) / 10 + 'km',(overlay.width / 2) + (x - overlay.width) / 2, overlay.height + (y - overlay.height)/2);
		ctx.font="15px Arial";
		ctx.fillText(self.poi[i].label,x,y);
	    }
	}
	animation = requestAnimationFrame(drawPOIInfo);
    }    

    // if options.remote is set, we don't try to capture the stream, orientation and geolocation — they'll be set externally
    if (!options || options.remote === false) {
	navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia ||
				   navigator.webkitGetUserMedia || navigator.msGetUserMedia);
	
	if (navigator.getUserMedia) {
	    navigator.getUserMedia({video:true, toString: function(){return 'video';}}, this.addStream, console.log);
	}	
	navigator.geolocation.getCurrentPosition(self.setPosition);
	window.addEventListener("deviceorientation", function(e) {
	    self.setOrientation(e.alpha);
	});    

    }
};