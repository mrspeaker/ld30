(function () {

	"use strict";

	var Asteroids = Ω.Class.extend({

		scale: 0.8,
		planets: null,

		numstars: 500,
		stars: null,

		init: function (screen) {
			this.screen = screen;
			this.player = screen.player;
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
			if (data.debug.gimmePlanet) {
				this.planets[1].x = this.player_craft.x;
				this.planets[1].y = this.player_craft.y - 200;
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
					this.screen.goto(p.isDepot ? "depot" : "land", p);
					return;
				}	
			}

			if (this.player_craft.crashed) {
                game.reset();
                return;
            }

            this.player_craft.tick(0);
            if (this.player_craft.thrust > 0) {
            	this.player.fuel -= this.player_craft.thrust;
            	if (this.player.fuel < 0) {
            		//
            	}
            }
		},

		depart: function () {
			var player = this.player_craft;
			player.halt();
			player.rotation += 180;
			var angle = (player.rotation - 90) * Math.PI / 180;
            player.x += Math.cos(angle) * 50;
            player.y += Math.sin(angle) * 50;
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

			c.fillStyle = data.collision;
			c.fillRect(Ω.env.w / 2 - 100, Ω.env.h - 100, 150, 40);

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

			this.renderHUD(gfx);
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx,
				player = this.player_craft;

			c.fillStyle = "#fff";
			c.fillText("FUEL: " + (this.player.fuel | 0), 30, 30);

			var mmw = 200,
				mmh = 160,
				mmx = gfx.w - mmw - 20,
				mmy = gfx.h - mmh - 20,
				mmxr = 0.09,
				mmyr = 0.09;

			c.fillStyle = "rgba(63, 63, 63, 0.7)";
			c.fillRect(mmx, mmy, mmw, mmh);

			c.fillStyle = "#fff";
			c.fillRect(mmw / 2 + mmx, mmh / 2 + mmy, 4, 4);

			this.planets.forEach(function (p) {
				var dx = (p.x - player.x) * mmxr,
					dy = (p.y - player.y) * mmyr;
				if (Math.abs(dx) > 100 || Math.abs(dy) > 80) {
					return;
				}

				if (p.isDepot && Ω.utils.toggle(300, 2)) {
					return;
				}
				c.fillStyle = p.col;
				c.fillRect(
					dx + mmx + mmw / 2, 
					dy + mmy + mmh / 2, 
					5, 5);
			});

		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Asteroids = Asteroids;
	
}());
