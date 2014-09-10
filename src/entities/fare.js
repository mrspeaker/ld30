(function () {
	"use strict";

	var Fare = Ω.Entity.extend({
		w: 40,
		h: 40,
		r: 40,

		tick: function () {
			return true;
		},

		render: function (gfx) {
			var c = gfx.ctx;

			c.strokeStyle = "#7a7";
			c.strokeRect(this.x, this.y, this.w, this. h);
		}
	});

	window.Fare = Fare;

}());
