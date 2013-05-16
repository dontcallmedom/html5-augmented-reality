
var ar = new AugmentedRealityViewer(document.getElementById('camera'), function(here, callback) {
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