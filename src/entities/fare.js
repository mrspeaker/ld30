(function () {
	"use strict";

	var Fare = Ω.Entity.extend({
		w: 32,
		h: 32,
		r: 32,

		sheet: new Ω.SpriteSheet("res/images/peepsheet.png", 32, 32),

		init: function (fare, screen) {
			this._super(fare.src.x - fare.src.size / 2 - (5), fare.src.y - fare.src.size - this.h);
			this.fare = fare;
			this.screen = screen;
			fare.src.addFare(this);
		},

		tick: function () {
			return true;
		},

		pickup: function () {
			console.log("pickup!", this.fare);
			var fare = this.fare;
			//fare.src.removeFare(this);
			fare.selected = true;
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
