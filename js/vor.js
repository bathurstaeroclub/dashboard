/***********************************************/
/* Copyright (C) 2013 by Dondi Michael Stroma. */
/* All rights reserved.                        */
/*                                             */
/***********************************************/

// TODO:
//
// - Games
//   - Hide and Seek
//   - Multiple Choice
//     - given aircraft, select correct instrument
//     - given instrument, select correct aircraft
// - Additional instrument presentations
//   - HSI presentation
//   - RMI presentation
// - Additional navaid types
//   - NDBs
//   - Localizers

//Ensures there will be no 'console is undefined' errors
window.console = window.console || (function(){
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();


var sim = {

	util: {
		circle: function(a){
			if (a < 0)
				a = a + 360;
			else if (a > 359)
				a = a - 360;
			if (a < 0 || a > 359) this.circle(a);
			return a;
		}
	},

	updateAirplaneHeading: function(elem){
		var v = parseInt(elem.value, 10);
		if (isNaN(v)) {
			elem.value = sim.airplane.heading;
			return false;
		}
		sim.airplane.heading = v;
		sim.overhead.draw();
	},

	turnAirplaneBy: function(amount){
		sim.airplane.heading = sim.util.circle(sim.airplane.heading + amount);
		document.getElementById('input-heading').value = sim.airplane.heading;
		sim.overhead.draw();
	},

	randomRepoAirplane: function(){
		var xr = sim.overhead.canvasSize[0];
		var yr = sim.overhead.canvasSize[1];
		var xp = parseInt(xr * Math.random());
		var yp = parseInt(yr * Math.random());
		var hdg = parseInt(360 * Math.random());
		sim.airplane.location = [xp, yp];
		sim.airplane.heading  = hdg;
		sim.overhead.draw();
		sim.vor1.draw();

		/* TODO: Allow the airplane heading setter to accept a callback so that we can update the heading input textbox */
		document.getElementById('input-heading').value = sim.airplane.heading;	
	},

	hideAirplane: function(){
		sim.airplane.visible = false;
		sim.overhead.draw();
	},

	showAirplane: function(){
		sim.airplane.visible = true;
		sim.overhead.draw();
	},

	overhead: {

		canvas: null,

		getCanvas: function(){
			var canvas  = document.getElementById('plan');
			this.canvas = canvas;
			this.canvas.getMousePos = function(evt){
				var rect = canvas.getBoundingClientRect();
				var mousePos = {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
				return mousePos;
			};
			this.ctx = canvas.getContext('2d');
			return canvas;
		},

		isMouseOnAirplane: function(mx, my){
			var scl = 2;
			var ax  = sim.airplane.location[0];
			var ay  = sim.airplane.location[1];
			if (mx >= ax - 6*scl && mx <= ax + 6*scl && my >= ay - 7*scl && my <= ay + 7*scl)
				return true;
			else
				return false;
		},

		isMouseOnVor: function(mx, my){
			var vx = sim.vor1.location[0];
			var vy = sim.vor1.location[1];
			if (mx >= vx - 4 && mx <= vx + 4 && my >= vy - 3 && my <= vy + 3)
				return true;
			else
				return false;
		},

		canvasSize: [480, 480],

		draw: function(){
			sim.overhead.getCanvas();

			var canvas = document.getElementById('plan');
			var ctx    = canvas.getContext('2d');

/*			ctx.beginPath();
			ctx.fillStyle = '#d5d9cb';
			ctx.rect(0, 0,   480, 480);
			ctx.fill();
*/
			ctx.clearRect(0, 0, 480, 480);
			
			sim.overhead.drawStation(sim.vor1.location[0], sim.vor1.location[1], 2);
			sim.overhead.drawAirplane(sim.airplane.location[0], sim.airplane.location[1], sim.airplane.heading, 2);
		},

		drawStation: function(ox, oy, scale){
			var canvas = document.getElementById('plan');
			var ctx    = canvas.getContext('2d');
			if (!scale) scale = 1;
			
			// Make it by default 12 tall and 8 wide
			var w =  8 * scale;
			var h = 12 * scale;
			x = ox + 2*scale;
			y = oy + 3*scale;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(x, y);
			ctx.lineTo(x - scale * 4, y); //left
			ctx.lineTo(x - scale * 6, y - scale * 3); //left up
			ctx.lineTo(x - scale * 4, y - scale * 6); //right up
			ctx.lineTo(x, y - scale * 6); // right
			ctx.lineTo(x + scale * 2, y - scale * 3); // right down
			ctx.lineTo(x, y); // left to origin
			//ctx.fillStyle = '#000033';
			ctx.strokeStyle = '#214561';
			//ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(ox, oy);
			ctx.lineTo(ox + 1, oy);
			ctx.lineTo(ox - 1, oy);
			ctx.stroke();
		},

		drawAirplane: function(ox, oy, heading, scale){
			if (!sim.airplane.visible) return false;
			var canvas = document.getElementById('plan');
			var ctx    = canvas.getContext('2d');
			if (!scale) scale = 1;

			var x = ox;
			var y = oy;

			if (!heading) heading = 0;

			ctx.translate(x, y);
			ctx.rotate(Math.PI*2*(heading/360));
			ctx.translate(-x, -y);

			ctx.beginPath();
			ctx.strokeStyle = '#d956ff';
			ctx.moveTo(x, y - 7*scale);
			ctx.lineTo(x, y + 7*scale);
			ctx.moveTo(x - 6*scale, y - 3*scale);
			ctx.lineTo(x + 6*scale, y - 3*scale);
			ctx.moveTo(x - 3*scale, y + 5*scale);
			ctx.lineTo(x + 3*scale, y + 5*scale);
			ctx.stroke();

			ctx.translate(x, y);
			ctx.rotate(-Math.PI*2*(heading/360));
			ctx.translate(-x, -y);
		},
	},

	airplane: {
		location: [100, 100],
		heading:  360,
		visible:  true,
	},

	vor1: {
		canvas: null,

		getCanvas: function(){
			var canvas  = document.getElementById('vor1');
			this.canvas = canvas;
			this.canvas.getMousePos = function(evt){
				var rect = canvas.getBoundingClientRect();
				var mousePos = {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
				return mousePos;
			};
			this.ctx = canvas.getContext('2d');
			return canvas;
		},

		canvasSize: [200,200],

		obsSetting: 360,
		location: [0, 0],
		cdiDisplacement: -1,
		to_from: 'from',

		obsLabel: function(){
			this.obsSetting = parseInt(this.obsSetting);
			if (this.obsSetting == 360 || this.obsSetting == 0)
				return 'N';
			else if (this.obsSetting == 90)
				return 'E';
			else if (this.obsSetting == 180)
				return 'S';
			else if (this.obsSetting == 270)
				return 'W';
			else if (this.obsSetting < 10)
				return '00' + this.obsSetting;
			else if (this.obsSetting < 100)
				return '0' + this.obsSetting;
			else
				return '' + this.obsSetting;
		},

		draw: function(){
			/* Calculate CDI position */
			var stat = sim.calculateCdiDeflection(this, sim.airplane);
			this.cdiDisplacement = stat.cdiDeflect;
			if (stat.from == null)
				this.to_from = 'X';
			else if (stat.from == true)
				this.to_from = 'from';
			else if (stat.from == false)
				this.to_from = 'to';

			var c     = this.getCanvas();
			var ctx   = c.getContext("2d");

			var outerRadius = this.canvasSize[0] * 0.45;
			var scaleRadius = this.canvasSize[0] * 0.33;
			var dotSpacing  = scaleRadius*2 / 12;

			// Erase it
			ctx.clearRect(0, 0, this.canvasSize[0], this.canvasSize[1]);

			// Draw inner CDI portion
			ctx.beginPath();
			ctx.lineWidth = 0;
			ctx.arc(this.canvasSize[0]/2, this.canvasSize[1]/2, scaleRadius, 0, Math.PI*2, true);
			ctx.fillStyle = 'black';
			ctx.strokeStyle = 'black';
			ctx.fill();
			ctx.stroke();

			// Draw white circle
/*
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.arc(this.canvasSize[0]/2, this.canvasSize[1]/2, scaleRadius, 0, Math.PI*2, true);
			ctx.strokeStyle = 'yellow';
			ctx.stroke();
*/

			// Draw "needle"
			var cdiDisplacement = this.cdiDisplacement;

			if (cdiDisplacement > 5.5) 
				cdiDisplacement = 5.5;
			else if (cdiDisplacement < -5.5)
				cdiDisplacement = -5.5;

			ctx.beginPath();
			ctx.lineWidth = 2;
			var x = this.canvasSize[0]/2 - scaleRadius + dotSpacing*(cdiDisplacement+6);
			var y = 0;
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.canvasSize[0]);
			ctx.strokeStyle = '#FFF';
			ctx.stroke();

			// Draw "dots"
			for (var i = 1; i <= 11; i++) {
				if (i == 6) {
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.arc(this.canvasSize[0]/2 - scaleRadius + dotSpacing*i, this.canvasSize[1]/2, 4, 0, Math.PI*2, true);
					ctx.strokeStyle = '#EEE';
					ctx.stroke();
				} else {
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.arc(this.canvasSize[0]/2 - scaleRadius + dotSpacing*i, this.canvasSize[1]/2, 2, 0, Math.PI*2, true);
					ctx.strokeStyle = '#EEE';
					ctx.fillStyle = '#EEE';
					ctx.stroke();
					ctx.fill();
				}
			}

			// Draw black area for obs compass rose (must be on top of needle)
			ctx.beginPath();
			ctx.lineWidth = (outerRadius-scaleRadius)*0.85;
			ctx.arc(this.canvasSize[0]/2, this.canvasSize[1]/2, outerRadius + 1 - (outerRadius - scaleRadius)/2, 0, Math.PI*2, true);
			ctx.strokeStyle = 'black';
			ctx.stroke();

			// Draw OBS compass rose label
			ctx.font = "13px Helvetica";
			ctx.textAlign = "center";
			ctx.fillStyle = 'white';

			ctx.translate(100, 100);
			ctx.rotate(-Math.PI*2*(this.obsSetting/360));
			ctx.translate(-100, -100);
			for (var i = 0; i <= 35.5; i = i + 0.5) {
				var tickMarkSize = 10;
				if (i % 1 != 0) tickMarkSize = 5;
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'white';
				ctx.moveTo(100, 33 - tickMarkSize);
				ctx.lineTo(100, 33);
				ctx.stroke();
				if (i % 3 == 0) {
					var label = i;
					if (i ==  0) label = 'N';
					if (i ==  9) label = 'E';
					if (i == 18) label = 'S';
					if (i == 27) label = 'W';
					ctx.fillText(label, 100, 25);
				}
				ctx.translate(100, 100);
				ctx.rotate(Math.PI*2*(5/360));
				ctx.translate(-100, -100); // undo translation
			}
			ctx.translate(100, 100);
			ctx.rotate(+Math.PI*2*(this.obsSetting/360));
			ctx.translate(-100, -100);

			ctx.fillStyle = 'white';
			//ctx.fillText(this.obsLabel(), scaleRadius*1.5, 27);

			// Draw OBS top pointer triangle
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.moveTo(100, 34);
			ctx.lineTo( 96, 44);
			ctx.lineTo(104, 44);
			ctx.lineTo(100, 34);
			ctx.strokeStyle = 'white';
			ctx.stroke();
			ctx.fillStyle = 'white';
			ctx.fill();

			// Draw OBS smaller bottom pointer triangle
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.moveTo(100, 166);
			ctx.lineTo( 98, 159);
			ctx.lineTo(102, 159);
			ctx.lineTo(100, 166);
			ctx.strokeStyle = 'white';
			ctx.stroke();
			ctx.fillStyle = 'white';
			ctx.fill();

			// Draw ambiguity indicator
			var ambLabel;
			if (this.to_from == 'from')
				ambLabel = 'FROM'
			else if (this.to_from == 'to')
				ambLabel = 'TO';
			else
				ambLabel = "////";

			ctx.font = '11px Helvetica';
			ctx.textAlign = "center";
			ctx.fillStyle = '#EEEE99';
			if (ambLabel == "////") ctx.fillStyle = 'red';
			ctx.fillText(ambLabel, this.canvasSize[0] * 0.66, this.canvasSize[1] * 0.43);

			// Draw box around ambiguity indicator
/*			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.moveTo(this.canvasSize[0] * 0.66 - 20, this.canvasSize[1] * 0.43 + 3);
			ctx.lineTo(this.canvasSize[0] * 0.66 + 20, this.canvasSize[1] * 0.43 + 3);
			ctx.strokeStyle = 'white';
			ctx.stroke();
*/

			// Draw OBS knob
			var obsx = this.canvasSize[0]/2*0.333;
			var obsy = this.canvasSize[1]/2*1.667;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.arc(obsx, obsy, 15, 0, Math.PI*2, true);
			ctx.strokeStyle = 'white';
			ctx.stroke();
			ctx.fillStyle="black";
			ctx.fill();
			ctx.fillStyle = '#DDBB00';

			// Draw OBS knob label
			ctx.font = "10px Helvetica";
			ctx.textAlign = "center";
			ctx.translate(obsx, obsy);
			ctx.rotate(+Math.PI*2*(this.obsSetting/360));
			ctx.fillText('OBS', 0, 3);
			ctx.rotate(-Math.PI*2*(this.obsSetting/360));
			ctx.translate(-obsx, -obsy);


			this.obsKnobLocation = { x: obsx, y: obsy, r: 12 };
			console.log('OBS knob coordinates: ' + this.obsKnobLocation.x + ', ' + this.obsKnobLocation.y);

			/*
			 var context = ctx;
			 context.save();
			 context.translate(newx, newy);
			 context.rotate(-Math.PI/2);
			 context.textAlign = "center";
			 context.fillText("Your Label Here", labelXposition, 0);
			 context.restore();
			*/

  		},

		isMouseOnObsKnob: function(mousePos){
			if (mousePos.y <= this.obsKnobLocation.y - this.obsKnobLocation.r || mousePos.y >= this.obsKnobLocation.y + this.obsKnobLocation.r)
				return false;
			else if (mousePos.x > this.obsKnobLocation.x && mousePos.x < this.obsKnobLocation.x + this.obsKnobLocation.r)
				return 1; // right half
			else if (mousePos.x < this.obsKnobLocation.x && mousePos.x > this.obsKnobLocation.x - this.obsKnobLocation.r)
				return -1; // left half
		},

		update: function(){
		},
	},

	calculateRadial: function(station, aircraft){
		var st_x = station.location[0];
		var st_y = station.location[1];
		var ac_x = aircraft.location[0];
		var ac_y = aircraft.location[1];

/*
		var lat1 = station.location[0];
		var lon1 = station.location[1];
		var lat2 = aircraft.location[0];
		var lon2 = aircraft.location[1];
		var tc1 = Math.atan2(Math.sin(lon1-lon2)*Math.cos(lat2), Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon1-lon2)) % 2*Math.PI;
		return alert(tc1 * (180/Math.PI));
*/

		var dist_x = ac_x - st_x;
		var dist_y = ac_y - st_y;

		var atan = 0;
		if (dist_y != 0 && dist_x != 0) atan = Math.atan(dist_x / dist_y);
		atan = atan * (180/Math.PI);
		if (dist_x > 0 && dist_y < 0)
			atan = Math.abs(atan);
		else if (dist_x > 0 && dist_y > 0)
			atan = 90 - atan + 90;
		else if (dist_x < 0 && dist_y > 0)
			atan = 180 + Math.abs(atan);
		else if (dist_x < 0 && dist_y < 0)
			atan = 360 - atan;
		else if (dist_x < 0 && dist_y == 0)
			atan = 270;
		else if (dist_x > 0 && dist_y == 0)
			atan = 90;
		else if (dist_x == 0 && dist_y > 0)
			atan = 180;
		else if (dist_x == 0 && dist_y < 0)
			atan = 360;
		return atan;
	},


	calculateCdiDeflection: function(station, aircraft){

		var actRad = sim.util.circle(sim.calculateRadial(station, aircraft));
		var obsRad = sim.util.circle(station.obsSetting);

		var diff   = -1 * (actRad - obsRad);

		if (diff < -180)
			diff = diff + 360;
		else if (diff > 180)
			diff = diff - 360;

		var diffRecip;
		if (diff < -90)
			diffRecip = diff + 180;
		else if (diff > 90)
			diffRecip = diff - 180;
		diffRecip = -1 * diffRecip;

		var sol;
		if (diff <= 90 && diff >= -90)
			sol = { offCourse: diff, cdiDeflect: diff/2, from: true };
		else if (diffRecip <= 90 && diffRecip >= -90)
			sol = { offCourse: diffRecip, cdiDeflect: diffRecip/2, from: false };
		else
			sol = { offCourse: null, cdiDeflect: null, from: null };

		if (sol.offCourse > 88 || sol.offCourse < -88) sol.from = null;

		return sol;
	},

	recipCourse: function(c){
		c = c + 180;
		if (c > 359) c = c - 360;
		return c;
	},
};

sim.vor1.location = [sim.overhead.canvasSize[0]/2, sim.overhead.canvasSize[1]/2];

sim.vor1.draw();

sim.overhead.draw();


sim.overhead.canvas.addEventListener('mousedown', function(event){
	var mousePos = sim.overhead.canvas.getMousePos(event);
	if (sim.overhead.isMouseOnAirplane(mousePos.x, mousePos.y)) {
		sim.airplane.isDragging = true;
		sim.airplane.dragOffset = 'not implemented';
		console.log('Begun dragging airplane!');
	}
	return false;
}, false);

sim.overhead.canvas.addEventListener('mousemove', function(event){
	var mousePos = sim.overhead.canvas.getMousePos(event);
	if (sim.airplane.isDragging == true) {
		sim.airplane.location = [mousePos.x, mousePos.y];
		sim.overhead.draw();
		sim.vor1.draw();
	} else {
		if (sim.overhead.isMouseOnAirplane(mousePos.x, mousePos.y)) {
			document.body.style.cursor = 'pointer';
		} else {
			document.body.style.cursor = 'auto';
		}
	}
	return false;
}, false);

sim.overhead.canvas.addEventListener('mouseup', function(event){
	var mousePos = sim.overhead.canvas.getMousePos(event);
	if (sim.airplane.isDragging == true) {
		sim.airplane.isDragging = false;
		console.log('Finished dragging airplane!');
	}
	return false;
}, false);

sim.vor1.canvas.addEventListener('mousemove', function(event){
	var mousePos = sim.vor1.canvas.getMousePos(event);
	var onKnob   = sim.vor1.isMouseOnObsKnob(mousePos);
	if (onKnob)
		document.body.style.cursor = 'pointer';
		//sim.vor1.canvas.cursor = 'pointer';
	else
		document.body.style.cursor = 'auto';
		//sim.vor1.canvas.cursor = 'auto';
	//end if	
	return false;
}, false);

var isClickingObsKnob = false;
var isHoldingObsKnob  = false;
sim.vor1.canvas.addEventListener('mousedown', function(event){
	var mousePos = sim.vor1.canvas.getMousePos(event);
	var onKnob   = sim.vor1.isMouseOnObsKnob(mousePos);
	if (onKnob) {
		isClickingObsKnob = setTimeout(function(){
			isHoldingObsKnob = setInterval(function(){
				sim.vor1.obsSetting = sim.vor1.obsSetting + 2*onKnob;
				if (sim.vor1.obsSetting < 0)
					sim.vor1.obsSetting = 360 + sim.vor1.obsSetting;
				else if (sim.vor1.obsSetting > 359)
					sim.vor1.obsSetting = sim.vor1.obsSetting - 360;
				sim.vor1.draw();
			}, 50);
		}, 400);
	}
	return false;
}, false);

sim.vor1.canvas.addEventListener('mousemove', function(event){
	/* This case is if the user mouses down, then moves off the button */
	var mousePos = sim.vor1.canvas.getMousePos(event);
	if (isClickingObsKnob || isHoldingObsKnob) {
		var onKnob = sim.vor1.isMouseOnObsKnob(mousePos);
		if (!onKnob) {
			if (isClickingObsKnob) clearTimeout(isClickingObsKnob);
			if (isHoldingObsKnob) clearInterval(isHoldingObsKnob);
			isClickingObsKnob = false;
			isHoldingObsKnob  = false;
		}
	}
	return false;
}, false);


sim.vor1.canvas.addEventListener('mouseup', function(event){
	if (isClickingObsKnob) clearTimeout(isClickingObsKnob);
	if (isHoldingObsKnob) clearInterval(isHoldingObsKnob);
	var mousePos = sim.vor1.canvas.getMousePos(event);
	var onKnob   = sim.vor1.isMouseOnObsKnob(mousePos);
	if (onKnob && !isHoldingObsKnob) {
		sim.vor1.obsSetting = sim.vor1.obsSetting + 1*onKnob;
		if (sim.vor1.obsSetting < 0)
			sim.vor1.obsSetting = 360 + sim.vor1.obsSetting;
		else if (sim.vor1.obsSetting > 359)
			sim.vor1.obsSetting = sim.vor1.obsSetting - 360;
		//end if
		sim.vor1.draw();
	}
	isClickingObsKnob = false;
	isHoldingObsKnob  = false;
	return false;
}, false);

/* Necessary for Chrome text selection issue*/
sim.vor1.canvas.onmousedown     = function(evt){ evt.preventDefault(); return false; };
sim.overhead.canvas.onmousedown = function(evt){ evt.preventDefault(); return false; };



document.getElementById('input-heading').value = 360;
sim.airplane.heading = 360;

alert("Welcome to the VOR simulator!\n\nThe simulator consists of map view depicting aircraft and VOR station position (left), map view aircraft controls (bottom), and VOR/CDI indicator with OBS selector (right).\n\nClick and drag the miniature airplane in the map view to move it. You can also adjust its heading, place it in a random new position, or hide the airplane from the map view with the map view aircraft controls.\n\nClick the right half of the OBS knob on the VOR indicator to increase the OBS selection; click the left half to decrease it. Hold the mouse button down to spin it faster!\n\nHave fun.");

