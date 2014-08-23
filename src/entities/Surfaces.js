(function () {

	window.Surfaces = window.Surfaces || {};

	var cage = function (w, h, gfx) {
		var c = gfx.ctx;

		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(50, h - 10);
		c.lineTo(w - 100, h - 10);
		c.lineTo(w, 0);
		c.lineTo(w, h);
		c.lineTo(0, h);
		c.closePath();

		c.fill();
	};

	Surfaces.a = function (gfx) {
		var c = gfx.ctx,
			w = 2000,
			h = 800,
			col = data.collision;

		c.fillStyle = col;

		cage(w, h, gfx);
		c.fillRect(300, 300, 300, 10);
	};

	Surfaces.b = function (gfx) {
		var c = gfx.ctx,
			w = 2000,
			h = 800,
			col = data.collision;

		c.fillStyle = col;

		cage(w, h, gfx);
		c.fillRect(800, 600, 300, 10);
		c.fillRect(200, 400, 150, 10);
	};

}());
