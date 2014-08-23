(function () {

	"use strict";

	var Player = Ω.Class.extend({
		cash: 0,
		fares: 0,
		fuel: 500,
		fuel_max: 9999,
		damage: 0
	});

	window.Player = Player;
	
}());
