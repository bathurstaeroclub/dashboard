"use strict;"

//import { playYBTH } from 'js/nav.js';

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
		$(".vol-off", svg)[0].style.transformBox = 'fill-box';
		$(".vol-off", svg)[0].style.transformOrigin = 'center';
		if (isPlaying) {
			console.log("Volume Off");
			audio.pause();
			$(".vol-off", svg)[0].style.transform = 'rotate(-70deg)';
			$("#comm_freq0", svg)[0].textContent = "";
			$("#comm_freq1", svg)[0].textContent = "";
			$("#nav_freq0", svg)[0].textContent = "";
			$("#nav_freq1", svg)[0].textContent = "";
		} else {
			console.log("Volume On");
			audio.play();
			$(".vol-off", svg)[0].style.transform = 'rotate(70deg)';
			$("#comm_freq0", svg)[0].textContent = "1 2 7 . 3 5";
			$("#comm_freq1", svg)[0].textContent = "1 3 3 . 2 5";
			$("#nav_freq0", svg)[0].textContent = "1 0 8 . 0 0";
			$("#nav_freq1", svg)[0].textContent = "1 1 7 . 9 5";
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

	let isPull25k = false;
	$(".pull-25k", svg).on("click", () => {
		console.log("Pull 25K");
		isPull25k = !isPull25k;
	});
	$(".pull-25k", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Pull-25K scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		let comm_freq1 = $("#comm_freq1", svg)[0].textContent;
		let i = parseInt(comm_freq1.replace(/\s+/gm,''));

		if (delta ==  1 ) {
			console.log("Pull-25K up");
			if (isPull25k) {
				i = i + 0.50;
			} else {
				i = i + 0.25;
			}
			if (i > 136.995) { i = 118.000; } // Wrap, VHF band is 118kHz - 136.995kHz.
		}
		if (delta == -1 ) {
			console.log("Pull-25K down");
			if (isPull25k) {
				i = i - 0.50;
			} else {
				i = i - 0.25;
			}
			if (i < 118.000) { i = 136.995; } // Wrap, VHF band is 118kHz - 136.995kHz.
		}
		$("#comm_freq1", svg)[0].textContent = i.toFixed(3).toString().split('').join(' ');
	});
	let isNavKnob = false;
	$(".nav-knob", svg).on("click", () => {
		console.log("Nav Knob");
		isNavKnob = !isNavKnob;
	});
	$(".nav-knob", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Nav Knob scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		let nav_freq1 = $("#nav_freq1", svg)[0].textContent;
		let i = parseInt(nav_freq1.replace(/\s+/gm,''));

		if (delta ==  1 ) {
			console.log("Nav up");
			if (isNavKnob) {
				i = i + 0.05;
			} else {
				i = i + 1.05;
			}
			if (i > 117.950) { i = 108.000; } // Wrap, VHF band is 108kHz - 117.950MHz (50kHz spacing).
		}
		if (delta == -1 ) {
			console.log("Nav down");
			if (isNavKnob) {
				i = i - 0.05;
			} else {
				i = i - 1.05;
			}
			if (i < 108.000) { i = 117.950; } // Wrap, VHF band is 108kHz - 117.950MHz (50kHz spacing).
		}
		$("#nav_freq1", svg)[0].textContent = i.toFixed(3).toString().split('').join(' ');
	});
	let isNavIdentPulled = false;
	$(".pull-ident", svg).on("click", () => {
		console.log("Pull Ident");
		if (isPlaying) {
			if (!isNavIdentPulled) {
				alert("Listening to NAV Ident");
				playYBTH(true);
			} else {alert("Ident Tone Attenuated");playYBTH(false);}
			isNavIdentPulled = !isNavIdentPulled;
		}
	});
	$(".pull-ident", svg).on("wheel", (e) => {
		e.preventDefault();
		console.log("Pull-Ident Knob scrolling..");
		var delta = Math.max(-1, Math.min(1, e.originalEvent.deltaY));

		if (delta ==  1 ) {console.log("Ident up");}
		if (delta == -1 ) {console.log("Ident down");}
	});

	let isCommFreq = false;
	$(".toggle-comm-freq", svg).on("click", () => {
		console.log("Toggling Comm Freq");
		if (isCommFreq) {
			s1 = $("#comm_freq0", svg)[0].textContent;
			s0 = $("#comm_freq1", svg)[0].textContent;
		} else {
			s0 = $("#comm_freq0", svg)[0].textContent;
			s1 = $("#comm_freq1", svg)[0].textContent;
		}
		$("#comm_freq0", svg)[0].textContent = s0;
		$("#comm_freq1", svg)[0].textContent = s1;
		isCommFreq = !isCommFreq;
	});
	let isNavFreq = false;
	$(".toggle-nav-freq", svg).on("click", () => {
		console.log("Toggling Nav Freq");
		if (isNavFreq) {
			s1 = $("#nav_freq0", svg)[0].textContent;
			s0 = $("#nav_freq1", svg)[0].textContent;
		} else {
			s0 = $("#nav_freq0", svg)[0].textContent;
			s1 = $("#nav_freq1", svg)[0].textContent;
		}
		$("#nav_freq0", svg)[0].textContent = s0;
		$("#nav_freq1", svg)[0].textContent = s1;
		isNavFreq = !isNavFreq;
	});

	$.getJSON('https://bac-ctaf-srv.bathurstaeroclub.com.au/status-json.xsl', (data) => {
		console.log(data);
		audio_title.innerHTML = data.icestats.source.title;
		$(".comm-display").innerHTML = data.icestats.source.title;
	});
});
