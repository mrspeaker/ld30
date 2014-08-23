(function () {

	"use strict";

	var Depot = Ω.Class.extend({
		frame: 0,
		init: function (id, screen) {
			this.frame = 0;
			this.id = id;
			this.screen = screen;
			this.player = screen.player;

			screen.player.fuel = screen.player.fuel_max;
		},
		tick: function () {
			if (this.frame++ > 150) {
				this.screen.goto("fly");
			}
		},

		render: function (gfx) {
			var c = gfx.ctx;
			c.fillStyle = "#fff";
			c.fillText("Depot!", 100, 100);
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Depot = Depot;
	
}());
