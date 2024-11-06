"use strict;"

const audio = document.querySelector("audio");
audio.removeAttribute('controls');

const audio_title = document.getElementById("audio-title");

const svgObj = document.getElementById("kx155");

// https://stackoverflow.com/questions/66868356/firefox-add-on-window-addeventlistener-load-init-not-firing-event
window.addEventListener("pageshow", (evt) => {
	console.log("kx155 svg loaded.");
	const svg = svgObj.contentDocument;
	//console.log( svg );

	let isPlaying = false;

	$(".vol-off", svg).on("click", () => {
		if (isPlaying) {
			console.log("Volume Off");
			audio.pause();
		} else {
			console.log("Volume On");
			audio.play();
		}
		isPlaying = !isPlaying;
	});
	$(".vol-off", svg).on("wheel", (e) => {
		e.preventDefault();
		//console.log("Volume scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		if (delta ==  1 && audio.volume <= 0.9) {console.log("V up");audio.volume+=0.1;}
		if (delta == -1 && audio.volume  > 0.1) {console.log("V down");audio.volume-=0.1;}
	});

	$(".pull-25k", svg).on("click", () => {
		console.log("Pull 25K");
	});
	$(".pull-25k", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Pull-25K scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		if (delta ==  1 ) {console.log("Pull-25K up");}
		if (delta == -1 ) {console.log("Pull-25K down");}
	});
	$(".nav-knob", svg).on("click", () => {
		console.log("Nav Knob");
	});
	$(".nav-knob", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Nav Knob scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		if (delta ==  1 ) {console.log("Nav up");}
		if (delta == -1 ) {console.log("Nav down");}
	});
	$(".pull-ident", svg).on("click", () => {
		console.log("Pull Ident");
	});
	$(".pull-ident", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Pull-Ident Knob scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		if (delta ==  1 ) {console.log("Ident up");}
		if (delta == -1 ) {console.log("Ident down");}
	});

	$(".toggle-comm-freq", svg).on("click", () => {
		console.log("Toggling Comm Freq");
	});
	$(".toggle-nav-freq", svg).on("click", () => {
		console.log("Toggling Nav Freq");
	});

	$.getJSON('https://bac-ctaf-srv.bathurstaeroclub.com.au/status-json.xsl', (data) => {
		console.log(data);
		audio_title.innerHTML = data.icestats.source.title;
		$(".comm-display").innerHTML = data.icestats.source.title;
	});
});
