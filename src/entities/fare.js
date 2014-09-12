(function () {
	"use strict";

	var Fare = Ω.Entity.extend({
		w: 40,
		h: 40,
		r: 40,

		init: function (fare, screen) {
			this._super(fare.src.x, fare.src.y);
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

			c.fillStyle = "#7a7";
			c.fillRect(this.x, this.y, this.w, this. h);
		}
	});

	window.Fare = Fare;

}());
