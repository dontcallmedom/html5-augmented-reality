if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

function distance(pos1, pos2) {
  var R = 6371000; // m
  var dLat = (pos2.latitude-pos1.latitude).toRad();
  var dLon = (pos2.longitude - pos1.longitude).toRad();
  var lat1 = pos1.latitude.toRad();
  var lat2 = pos2.latitude.toRad();
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
    console.log(angle);
   return {distance:d, angle:angle, label:obj.label};
}