(function () {

	"use strict";

	var Depot = Ω.Class.extend({
		frame: 0,
		init: function (planet, screen) {
			this.frame = 0;
			this.planet = planet;
			this.screen = screen;
			this.player = screen.player;
		},
		tick: function () {
			if (this.frame++ > 150) {
				this.screen.goto("fly", this.planet);
			}
		},

		render: function (gfx) {
			var c = gfx.ctx;
			c.fillStyle = "#fff";
			c.fillText("Ah, the old depot. Some quiet time.", 100, 100);

			if (Ω.utils.toggle(300, 2)) {
				c.fillText("\"Hey guys!\"", 100, 160);
			}
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Depot = Depot;
	
}());
