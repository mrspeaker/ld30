(function () {

	"use strict";

	var Planet = Ω.Class.extend({
		size: 30,
		init: function (id, x, y, size, isDepot) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.id = id;
			this.visits = 0;
			this.isDepot = isDepot || false;
			this.surface = Surfaces[data.surfaces[id % data.surfaces.length]];

			this.col = "hsl(" + Ω.utils.rand(360) + ", 40%, 50%)";
		},
		tick: function () {

		},
		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = this.col;
			c.beginPath();
			c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
			c.fill();

			c.fillStyle = "#fff";
			if (this.isDepot) {
				c.fillText("DEPOT", this.x - 50 + (this.size / 2), this.y + this.size + 18);
			} else {
				c.fillText("planet " + this.id, this.x - 55 + (this.size / 2), this.y + this.size + 18);
			}
			c.fillText(this.visits, this.x + (this.size / 2), this.y + (this.size / 2));
		}
	});

	window.Planet = Planet;
}());