(function (Ω) {

	"use strict";

	var WinScreen = Ω.Screen.extend({

		count: 0,

		init: function () {

		},

		render: function (gfx) {

			var c = gfx.ctx;

			this.clear(gfx, "#fff");

			c.fillStyle = "hsla(" + (this.count / 2 % 360) + ", 50%, 40%, " + ((Math.sin(this.count / 100) + 1) / 2) + ")";
			c.fillRect(0, 0, gfx.w, gfx.h);

			c.fillStyle = "hsl(" + (this.count / 6 % 360) + ", 50%, 20%)";
			c.font = "24pt monospace";

			var xback = 260;
			if (this.count < 400) {
				c.fillText("There can be only one GüBerMan", gfx.w / 2 - xback, gfx.h / 2);
				c.fillText("You are that man/woman.", gfx.w / 2 - xback, gfx.h * 0.56);
			} else if (this.count < 800) {
				c.fillText("You have connected many", gfx.w / 2 - xback, gfx.h / 2);
				c.fillText("and now you have won.", gfx.w / 2 - xback, gfx.h * 0.56);

			} else if (this.count < 1200) {
				c.fillText("A game made in 48 hours", gfx.w / 2  - xback, gfx.h / 2);
				c.fillText("by Mr Speaker.", gfx.w / 2  - xback, gfx.h * 0.56);
			}

		},

		tick: function () {

			if ((this.count++ > 150 && (Ω.input.isDown("escape") || Ω.input.isDown("space"))) || this.count > 2000) {

				game.setScreen(new IntroScreen());

			}

		}

	});

	window.WinScreen = WinScreen;

}(Ω));
