(function () {

	"use strict";

	var LunarLander = Ω.Class.extend({

		scale: 1,
		isGravity: true,

		loaded: false,

		init: function (planet, screen) {
			this.planet = planet;
			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);

			this.planet.visits++;
			
			this.loaded = false;

			var self = this;
			new Ω.Tiled("res/surfaces/" + planet.surface + ".json?" + Date.now(), function (level, err) {
				if (err) {
					console.log("Error loading surface:", err);
					return;
				}

				self.loaded = true;
				self.parse(level);

			});

		},

		parse: function (level) {

			this.surface = level.layer("surface").type("ground");
			this.pads = level.layer("pads").type("pad");

		},

		tick: function () {

			if (!this.loaded) return;

			this.scale += Math.sin(Date.now() / 1000) * 0.003;
	
			if (this.player_craft.crashed) {
                this.screen.goto("fly");
                return;
            }

            if (this.player_craft.y < -25) {
                this.screen.goto("fly");
                return;
            }

            this.player_craft.tick(this.isGravity ? 0.05 : 0);
            if (this.player_craft.thrust > 0) {
            	this.player.fuel -= this.player_craft.thrust;
            	if (this.player.fuel < 0) {
            		//
            	}
            }
		},

		render: function (gfx) {

			if (!this.loaded) return;

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
			this.surface.forEach(function (ground) {
				var polyline = ground.polyline;
				c.beginPath();
				c.moveTo(ground.x + polyline[0].x, ground.y + polyline[0].y);
				polyline.slice(1).forEach(function (p) {
					c.lineTo(ground.x + p.x, ground.y + p.y);
				});
				c.closePath();
				c.fill();
			});

			c.fillStyle = "hsl(200, 70%, 60%)";
			this.pads.forEach(function (pad) {
				c.fillRect(pad.x, pad.y - 5, pad.width, 5);
			});

			player.checkGroundCol(gfx);
			player.render(gfx);

			c.restore();

			this.renderHUD(gfx);
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "#fff";
			c.fillText("FUEL: " + (this.player.fuel | 0), 30, 30);
			c.fillText(
				(this.player_craft.x | 0) + ":" + 
				(this.player_craft.y | 0), 30, 60);

			c.fillText("p:" + this.player_craft.pixels[2].slice(0, 3).join("-"), 30, 90);

		}
	});

	window.Levels = window.Levels || {};
	window.Levels.LunarLander = LunarLander;
	
}());
