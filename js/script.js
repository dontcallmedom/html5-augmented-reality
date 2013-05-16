
var ar = new AugmentedRealityViewer(function(here, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "js/data.json", true);
    xhr.onload = function() { 
	try {
	    var data = JSON.parse(xhr.responseText);
	    callback(data);
	} catch (e) {
	    console.log(e);
	}	
    };
    xhr.send();
});
ar.setViewer(document.getElementById('camera'));