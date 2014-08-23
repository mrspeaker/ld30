(function () {

	"use strict";

	var Player = Ω.Class.extend({
		cash: 0,
		guber_class: 0,
		guber_rank: 0,
		fares: 0,
		fuel: null,
		fuel_max: 499,
		damage: 0,
		init: function () {
			this.fuel = this.fuel_max
		}
	});

	window.Player = Player;
	
}());
