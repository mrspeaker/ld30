(function () {

	"use strict";

	var Planet = Ω.Class.extend({
		size: 30,
		fares: null,
		init: function (id, name, x, y, size, isDepot) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.id = id;
			this.name = name;
			this.visits = 0;
			this.isDepot = isDepot || false;
			this.surface = data.surfaces[id % data.surfaces.length];
			this.fares = [];

			var col = Ω.utils.rand(360);
			this.col = "hsl(" + col + ", 40%, 50%)";
			this.darker = "hsl(" + col + ", 40%, 35%)"
		},
		tick: function (screen, player) {
			this.fares = this.fares.filter(function (f) { 
				if (!player.shield && Ω.math.dist(f, player) < f.r * 2) {
	                screen.pickupFare(f, player);
	                return false;
	            }
				return f.tick(); 
			});

			return true;
		},

		addFare: function (fare) {
			this.fares.push(fare);
		},
		removeFare: function (fare) {
			this.fares = this.fares.filter(function (f) {
				return f !== fare;
			});
		},

		render: function (gfx) {
			var c = gfx.ctx;

			c.fillStyle = this.col;
			c.beginPath();
			c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
			c.fill();
			c.fillStyle = this.darker;
			c.beginPath();
			var off = this.size * 0.1 | 0;
			c.arc(this.x + off, this.y + off, this.size - (off * 2), 0, Math.PI * 2, false);
			c.fill();


			c.fillStyle = "#777";
			if (this.isDepot) {
				c.fillText("DEPOT", this.x - 50 + (this.size / 2), this.y + this.size + 18);
			} else {
				c.fillText(this.name, (this.x - (this.name.length * 8.5) + (this.size / 2)) | 0, this.y + this.size + 26);
			}

			this.fares.forEach(function (f) {
				f.render(gfx);
			});
			
		}
	});

	window.Planet = Planet;
}());