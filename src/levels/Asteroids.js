(function () {

	"use strict";

	var Asteroids = Ω.Class.extend({

		scale: 0.5,
		isGravity: false,
		planets: null,

		numstars: 500,
		stars: null,

		init: function (screen) {
			this.screen = screen;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
			this.planets = [];
			for (var i = 0; i < 10; i++) {
				var p = new Planet(
					i,
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(25, 45),
					i > 8);
				this.planets.push(p);
			}

			this.stars = [];
			for (i = 0; i < this.numstars; i++) {
				this.stars.push([
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(-1500, 2500)
				]);
			}
		},

		tick: function () {

			for (var i = 0; i < this.planets.length; i++) {
				var p = this.planets[i];
				var dist = Ω.math.dist(this.player_craft, p);
				if (dist < 50 + p.size) {
					this.screen.goto(p.isDepot ? "depot" : "land", p.id);
					return;
				}	
			}

			if (this.player_craft.crashed) {
                game.reset();
                return;
            }

            this.player_craft.tick(this.isGravity ? 0.05 : 0);
		},

		depart: function () {
			var player = this.player_craft;
			player.halt();
			player.rotation += 180;
			var angle = (player.rotation - 90) * Math.PI / 180;
            player.x += Math.cos(angle) * 30;
            player.y += Math.sin(angle) * 30;
		},

		render: function (gfx) {
			var c = gfx.ctx;
			c.save();

			var scale = this.scale,
			    player = this.player_craft;

			c.scale(scale, scale);
			c.translate(
			    -player.x + ((gfx.w / 2) / scale),
			    -player.y + ((gfx.h / 2) / scale)
			);

			c.fillStyle = "#800";

			c.fillRect(Ω.env.w / 2 - 100, Ω.env.h - 100, 200, 10);

			c.fillStyle = "#999";
			this.stars.forEach(function (s) {
				c.fillRect(s[0], s[1], 3, 3);
			});

			this.planets.forEach(function (p) {
				p.render(gfx);
			});

			player.checkGroundCol(gfx);
			player.render(gfx);

			c.restore();
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Asteroids = Asteroids;
	
}());
