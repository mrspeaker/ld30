(function () {
	"use strict";

	var Fare = Ω.Entity.extend({
		w: 32,
		h: 32,
		r: 32,

		spring: null,

		sheet: new Ω.SpriteSheet("res/images/peepsheet.png", 32, 32),

		init: function (fare, screen, player) {
			this._super(fare.src.x - fare.src.size / 2 - 4, fare.src.y - fare.src.size - this.h);
			this.fare = fare;
			console.log(fare)
			this.screen = screen;
			this.player = player;
			fare.src.addFare(this);

			//this.x = this.player.x;
			//this.y = this.player.y;

			this.spring = new Spring(75, 0.02, 0.98, 0);
		},

		tick: function () {

			if (!this.fare.pickedUp) {
				
			} else {
				var vel = this.spring.tick(this.player, this);
				if (Math.abs(vel[0]) > 0.001 || Math.abs(vel[1]) > 0.001) {
					this.x += vel[0];
					this.y += vel[1];
				}
			}

			return true;
		},

		pickup: function () {
			var fare = this.fare;
			//fare.src.removeFare(this);
			// TODO: this is EVERYWHERE!
			fare.selected = true;
			fare.pickedUp = true;
			console.log("pickup on fare... ")
			this.screen.pickedUpFare(fare);
		},

		render: function (gfx) {
			var c = gfx.ctx;

			//c.fillStyle = "#7a7";
			//c.fillRect(this.x, this.y, this.w, this. h);
			this.sheet.render(gfx, Ω.utils.toggle(200, 2), 0, this.x, this.y);
		}
	});

	window.Fare = Fare;

}());
