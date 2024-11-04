$("#kx155.vol-off").on("click", function() {
	console.log("Volume");
});
$("#kx155.pull-25k").on("click", function() {
	console.log("Pull 25K");
});
$("#kx155.pull-ident").on("click", function() {
	console.log("Pull Ident");
});

$("#kx155.toggle-comm-freq").on("click", function() {
	console.log("Toggling Comm Freq");
});
$("#kx155.toggle-nav-freq").on("click", function() {
	console.log("Toggling Nav Freq");
});

$.getJSON('https://bac-ctaf-srv.bathurstaeroclub.com.au/status-json.xsl', function(data) {
	console.log(data);
	document.getElementById("audio-title").innerHTML = data.icestats.source.title;
//	$("#kx155.comm-display").innerHTML = data.icestats.source.title;
});
