const audio = document.querySelector("audio");
audio.removeAttribute('controls');

const audio_title = document.getElementById("audio-title");

const svgObj = $("#kx155");

svgObj.on("load", () => {
	console.log("kx155 svg loaded.");
	const svg = svgObj[0].contentDocument;
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
	$(".nav-knob", svg).on("click", () => {
		console.log("Nav Knob");
	});
	$(".pull-ident", svg).on("click", () => {
		console.log("Pull Ident");
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
