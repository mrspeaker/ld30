(function () {
	"use strict";

	var data = {
		collision: "rgb(126, 75, 15)",
		collisionRgb: [126, 75, 15],

		framesPerHour: 1000,
		
		surfaces: [
			"simple",
			"test",
			"test2"
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
			max_velocity: 1.4
		},

		debug: {
			gimmePlanet: false
		}
	};

	window.data = data;
}());