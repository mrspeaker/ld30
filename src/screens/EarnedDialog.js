(function () {

	"use strict";

	var EarnedDialog = Ω.Dialog.extend({

		init: function (rated, fare, player) {
			this.rated = rated;
			this.fare = fare;
			this.player = player;
		},

		tick: function () {

			this._super(game.preset_dt);

			if (this.time > 0.5) {
				if (Ω.input.pressed("space") || 
            	    Ω.input.pressed("moused") || 
            		Ω.input.pressed("up") || 
            		Ω.input.pressed("down") || 
            		Ω.input.pressed("left") || 
            		Ω.input.pressed("right")) {
						this.done();
            	}
			}
		},

		render: function (gfx) {

			this._super(gfx);

			var c = gfx.ctx,
				yOff = 200,
				xOff = 230;

			c.fillStyle = "#fff";
			c.fillText("Ride rating  : ", xOff, yOff);
			c.fillText("Difficulty   : ", xOff, yOff + 30);
			c.fillText("GüBer Cred++ : ", xOff, yOff + 60);
			c.fillText("World-wide GüBer ranking ", xOff, yOff + 100);

			xOff += 190;
			c.fillStyle = data.colors.theYellow;
			c.strokeStyle = data.colors.theYellow;

			c.fillText(this.fare.credEarned, xOff, yOff + 60);
			c.fillText(this.player.ranking[1], xOff - 100, yOff + 140);

			c.font = "18pt monospace";
			var outta5 = this.rated * 5,
				half = outta5 % (outta5 | 0) >= 0.5,
				rating = Math.max(1, this.rated * 5 | 0);
			for (var j = 0; j < rating; j++) {
				c.fillText("★", j * 25 + xOff, yOff + 3);
			}
			if (half) {
				c.strokeText("★", (j) * 25 + xOff, yOff + 3);
			}

			c.font = "30pt monospace";
			var difficulty = Math.max(1, this.fare.difficulty * 5 | 0);
			for (j = 0; j < difficulty; j++) {
				c.fillText("☠", j * 25 + xOff, yOff + 36);
			}

		}

	});

	window.EarnedDialog = EarnedDialog;

}());
