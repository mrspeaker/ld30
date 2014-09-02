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

		starSystem: {
			minx: -1500,
			miny: -1500,
			maxx: 2500,
			maxy: 2500
		},
		
		surfaces: [
			{ name: "level00", pads: [3, 1]},
			{ name: "level01", pads: [7, 5, 4]},
			{ name: "level02", pads: [8, 4, 1, 6]},
			{ name: "level03", pads: [10]}
		],

		physics: {},
		physics_space: {
			thrust: 0.22,
			friction: 0.985,
			braking: 0.96,
			rot_thrust: 0.3,
			rot_friction: 0.9,
			gravity: 0.0
		},

		physics_planet: {
			thrust: 0.11,
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
			gimmePlanet: false
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