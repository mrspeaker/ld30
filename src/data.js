(function () {
	"use strict";

	var data = {
		collision: "rgb(126, 75, 15)",
		collisionRgb: [126, 75, 15],

		framesPerHour: 1000,
		
		surfaces: [
			{ name: "simple", pads: 1 },
			{ name: "test", pads: 3 },
			{ name: "test2", pads: 3 }
		],

		physics: {
			thrust: 0.1,
			friction: 0.99,
			rot_thrust: 0.1,
			rot_friction: 0.95,
			gravity: 0.05
		},

		landing: {
			max_rot: 6.0,
			max_velocity: 1.5
		},

		debug: {
			gimmePlanet: false
		}
	};

	window.data = data;
}());