(function (Ω) {

	"use strict";

	var Particle = Ω.Class.extend({

		particles: null,
		running: false,

		init: function (opts, cb) {

			this.start = opts.start || {};
			this.end = opts.end || {};
			this.mix = {};
			this.start.col = this.start.col || {r: 255, g: 0, b: 0, a: 1.0};
			this.end.col = this.end.col || {r: 0, g: 0, b: 100, a: 0.0};
			this.maxLife = opts.life || 40;
			this.life = this.maxLife;
			this.continuous = true;
			this.rate = 3;
			this.maxParticles = 20;
			this.cb = cb;
			this.obj = opts.obj;

			this.particles = [];
			for(var i = 0; i < this.maxParticles; i++) {
				this.particles.push(
					new Part({}, this)
				);
			}

		},

		play: function (x, y) {
			
			this.life = this.maxLife ;
			this.x = 0;//x;
			this.y = 0;//y;
			this.running = true;
			this.particles.forEach(function (p) {
				p.reset();
			});

		},

		tick: function (x, y) {

			if (x || y) {
				this.x = x;
				this.y = y;
			}
			else {
				if (this.obj) {
					this.x = this.obj.x;
					this.y = this.obj.y;
				}
			}

			if (!this.running) {
				return;
			}

			this.life -= 1;

			var addOne = this.life % this.rate === 0;
			this.particles.forEach(function (p) {
				if (addOne && p.life <= 0) {
					p.reset(x, y);
					p.life = p.parent.maxLife * 3;
					p.life -= Ω.utils.rand(30);
					p.maxLife = p.life;
					addOne = false;
				}
				p.tick();
			});

			if (!this.continuous && this.life < 0) {
				this.running = false;
				this.cb && this.cb();
			}

		},

		render: function (gfx) {

			var self = this;

			if (!this.running) {
				return;
			}

			this.particles.forEach(function (p) {
				p.render(gfx, self.x, self.y);
			});

		}

	});

	function Part (opts, parent) {
		this.parent = parent;
		this.x = 0;
		this.y = 0;
		this.w = 7;
		this.h = 7;
		this.start = parent.start;
		this.end = parent.end;
		this.xSpeed = Math.random() * 2 - 1;
		this.ySpeed = Math.random() * 2 - 1 - 1;
	}
	Part.prototype = {

		reset: function (x, y) {
			this.life = 0;
			this.x = 0;
			this.y = 0;
			this.xSpeed = Math.random() * 2 - 1;
			this.ySpeed = Math.random() * 2 - 1;// - 3;
		},

		tick: function () {
			if (this.life-- < 0) {
				return;
			}
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			//this.ySpeed += 0.2;
		},

		render: function (gfx, x, y) {

			var c = gfx.ctx;

			x = 0; y = 0;
			if (this.life < 0) {
				return;
			}			

			var diffR = this.start.col.r - this.end.col.r,
				diffG = this.start.col.g - this.end.col.g,
				diffB = this.start.col.b - this.end.col.b,
				diffA = this.start.col.a - this.end.col.a,
				perc = this.life / this.maxLife;

			var r = (diffR * perc) + this.end.col.r | 0,
				g = (diffG * perc) + this.end.col.g | 0,
				b = (diffB * perc) + this.end.col.b | 0,
				a = (diffA * perc) + this.end.col.a;

			c.fillStyle = "rgb(" + r + "," + g + ", " + b + ")";
			c.fillRect(this.x + x, this.y + y, this.w, this.h);

		}

	};

	Ω.Particle = Particle;

}(window.Ω));
