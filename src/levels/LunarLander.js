(function () {

	"use strict";

	var LunarLander = Ω.Class.extend({

		scale: 1,
		isGravity: true,

		init: function (id, screen) {
			this.id = id;
			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
		},
		tick: function () {

			this.scale += Math.sin(Date.now() / 1000) * 0.003;
	
			if (this.player_craft.crashed) {
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

			c.beginPath();
			c.moveTo(0, 10);
			c.lineTo(50, 150);
			c.lineTo(150, 250);
			c.lineTo(0, 250);
			c.closePath();
			c.fill();

			c.fillRect(0, 230, 400, 10);

			player.checkGroundCol(gfx);
			player.render(gfx);

			c.restore();

			this.renderHUD(gfx);
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "#fff";
			c.fillText("FUEL: " + (this.player.fuel | 0), 30, 30);

		}
	});

	window.Levels = window.Levels || {};
	window.Levels.LunarLander = LunarLander;
	
}());
