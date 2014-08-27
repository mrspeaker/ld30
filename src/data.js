(function () {
	"use strict";

	var data = {
		collision: "rgb(126, 75, 15)",
		collisionRgb: [126, 75, 15],

		colors: {
			theYellow: "rgb(191, 188, 21)",
			_intro: "rgb(191, 188, 21)",
			_thrust: "hsl(70, 90%, 50%)"
		},

		framesPerHour: 50,

		cash: {
			cabPrice: 5000,
			uberRankReduceOnCrash: 350
		},
		
		surfaces: [
			{ name: "cavern", pads: 6, hard:[1, 4, 6, 9, 5, 10] },
			{ name: "tree", pads: 5, hard:[2, 8, 3, 3, 9] },
			{ name: "simple", pads: 1, hard:[1] },
			{ name: "test", pads: 3, hard:[4, 6, 2] },
			{ name: "test2", pads: 4, hard:[2, 4, 5, 2] }
		],

		physics: {},
		physics_space: {
			thrust: 0.1,
			friction: 0.985,
			braking: 0.96,
			rot_thrust: 0.18,
			rot_friction: 0.9,
			gravity: 0.0
		},

		physics_planet: {
			thrust: 0.1,
			friction: 0.99,
			braking: 0.96,
			rot_thrust: 0.1,
			rot_friction: 0.92,
			gravity: 0.04
		},

		landing: {
			max_rot: 10.0,
			max_velocity: 2.5
		},

		debug: {
			gimmePlanet: true
		},

		names: {
			planets: [
				"Yuengling",
				"Tusker",
				"Sweetwater",
				"Dogfish",
				"Redhook",
				"Einbecker",
				"Radeberger",
				"Affligem",
				"Ambrel",
				"Bacchus",
				"Belgo",
				"Cerisette",
				"Grimbergen",
				"Watermolen"
			]
		}
	};

	window.data = data;
}());