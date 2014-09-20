(function () {
	"use strict";

	var Fare = Ω.Entity.extend({
		w: 32,
		h: 32,
		r: 32,

		rotation: 0,

		spring: null,

		sheet: new Ω.SpriteSheet("res/images/peepsheet.png", 32, 32),

		init: function (fare, screen, player) {
			this._super(fare.src.x - fare.src.size / 2 - 4, fare.src.y - fare.src.size - this.h);
			this.fare = fare;
			this.screen = screen;
			this.player = player;
			fare.src.addFare(this);

			this.spring = new Spring(75, 0.03, 0.98, 0);
		},

		tick: function () {

			if (!this.fare.pickedUp) {
				
			} else {
				var vel = this.spring.tick(this.player, this);
				if (Math.abs(vel[0]) > 0.001 || Math.abs(vel[1]) > 0.001) {
					this.x += vel[0];
					this.y += vel[1];
				}
				//console.log(this.player.vtotal)
				if (this.player.vtotal > 0.3) {
					this.rotation = Ω.utils.now() / 500;
					this.x += Math.cos(Ω.utils.now() / 200) * 1;
					this.y += Math.cos(Ω.utils.now() / 200) * 1;
				}
			}

			return true;
		},

		pickup: function () {
			var fare = this.fare;
			// TODO: this is EVERYWHERE!
			fare.selected = true;
			fare.pickedUp = true;
			this.screen.pickedUpFare(fare);
		},

		render: function (gfx) {
			var c = gfx.ctx;

			//c.fillStyle = "#7a7";
			//c.fillRect(this.x, this.y, this.w, this. h);
			if (!this.fare.pickedUp) {
				this.sheet.render(gfx, Ω.utils.toggle(200, 2), 0, this.x, this.y);
			} else {
				c.save();
				c.translate(this.x + this.w / 2, this.y + this.h / 2);
				c.rotate(this.rotation);

				this.sheet.render(gfx, 2, 0, 0, 0);
				c.restore();
			}
		}
	});

	window.Fare = Fare;

}());
