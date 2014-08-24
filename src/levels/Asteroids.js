(function () {

	"use strict";

	var Asteroids = Ω.Class.extend({

		scale: 0.8,
		planets: null,

		numstars: 500,
		stars: null,

		doneIntro: false,
		state: null,

		message: "",
		message_blink: 0,
		message_last: "",

		audio: {
			theme: new Ω.Sound("res/audio/theme", 0.6, 1)
		},

		themeStarted: false,

		init: function (screen) {

			this.state = new Ω.utils.State("BORN");

			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
			this.planets = [];
			for (var i = 0; i < 10; i++) {
				var p = new Planet(
					i,
					data.names.planets[i],
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(25, 45),
					i > 8);
				this.planets.push(p);
			}
			if (data.debug.gimmePlanet) {
				this.planets[1].x = this.player_craft.x;
				this.planets[1].y = this.player_craft.y - 200;
			}

			this.stars = [];
			for (i = 0; i < this.numstars; i++) {
				this.stars.push([
					Ω.utils.rand(-1500, 2500),
					Ω.utils.rand(-1500, 2500)
				]);
			}
		},

		tick: function () {

			this.state.tick();
			switch(this.state.get()) {
			case "BORN":
				if (this.state.first()) {
					this.state.set("INTRO");
					break;
				}
				this.state.set("READY");
				break;
			case "INTRO":
				this.setMessage("Select a fare [1-4]", 10000);
				if (this.state.count > 50) {
					this.doneIntro = true;
					this.state.set("READY");
				}
				break;
			case "READY":
				if (this.state.count > 20) {
					this.state.set("FLYING");
				}
				break;
			case "FLYING":
				if (this.state.count < 52) {
					// Fade in
					this.audio.theme.audio.volume = this.audio.theme.audio._volume * (this.state.count / 51);
				}
				if (this.state.count === 300 && !this.themeStarted) {
					this.audio.theme.play();
					this.themeStarted = true;
				}
				this.tick_flying();
				break;
			case "APPROACHING":
				var player = this.player_craft;
				if (this.state.first()) {
					player.disableControls();
				}
				// Fade out
				this.audio.theme.audio.volume = this.audio.theme.audio._volume * (1 - (this.state.count / 51));
				if (this.state.count > 50) {
					var planet = this.state.data;
					this.state.set("FLYING");
					this.screen.goto(planet.isDepot ? "depot" : "land", planet);
				}
				// Slow it down;
				player.vx *= 0.96;
				player.vy *= 0.96;
				player.rvx *= 0.96;
				player.rvy *= 0.96;
				player.thrust = 0;
				player.tick(0);
				break;
			case "CRASHED":
				if (this.state.count > 100) {
					game.reset();
				}
				break;
			}

		},

		tick_flying: function () {
			var player = this.player_craft;
			for (var i = 0; i < this.planets.length; i++) {
				var p = this.planets[i];
				var dist = Ω.math.dist(player, p);
				
				// If close, and not going too fast... LAND!
				if (dist < 50 + p.size) {
					if (player.vtotal < 2) {
						this.state.set("APPROACHING", p);
						return;
					}	
						
					//return;
				}
			}

			if (this.player_craft.crashed) {
			    game.reset();
			    return;
			}

			this.player_craft.tick(0);
			// Removed fuel from teh game
			/*if (this.player_craft.thrust > 0) {
				this.player.fuel -= this.player_craft.thrust;
				if (this.player.fuel < 0) {
					//
				}
			}*/
		},

		depart: function (planet) {
			var player = this.player_craft;
			player.halt();
			player.rotation = 0;
			player.enableControls();
			//var angle = (player.rotation - 90) * Math.PI / 180;
            //player.x += Math.cos(angle) * 80;
            //player.y += Math.sin(angle) * 80;
            player.x = planet.x - player.w / 2;
            player.y = planet.y - player.h - planet.size - 55;
		},

		render: function (gfx) {
			var c = gfx.ctx;

			this.renderWorld(gfx);

			gfx.ctx.font = "12pt monospace";
			this.renderHUD(gfx);
			this.renderFares(gfx);

			gfx.ctx.font = "16pt monospace";
			if (this.state.is("INTRO")) {
				c.fillStyle = "#fff";

				c.fillText("Ready...", gfx.w / 2 - 40, gfx.h / 2);
			}
			if (this.state.is("APPROACHING")) {
				c.fillStyle = "#fff";

				c.fillText("Landing on " + this.state.data.name, gfx.w / 2 - 100, 200);

			}
		},

		renderWorld: function (gfx) {

			var c = gfx.ctx;
			c.save();

			var scale = this.scale,
			    player = this.player_craft,
			    midW = ((gfx.w / 2) / scale),
			    midH = ((gfx.h / 2) / scale);

			c.scale(scale, scale);
			c.translate(
			    -player.x + midW,
			    -player.y + midH
			);

			var left = player.x - midW,
				right = player.x + midW,
				top = player.y - midH,
				bottom = player.y + midH,
				inBounds = function (e) {
					var w = e.size;
					return e.x + w > left && e.x - w < right && e.y + w > top && e.y - w < bottom;
				}

			//c.fillStyle = data.collision;
			//c.fillRect(Ω.env.w / 2 - 100, Ω.env.h - 100, 150, 40);

			c.fillStyle = "#999";
			this.stars.forEach(function (s) {			
				if (s[0] < left || s[0] > right) {
					return;
				}
				if (s[1] < top || s[1] > bottom) {
					return;
				}
				c.fillRect(s[0], s[1], 3, 3);
			});

			this.planets.forEach(function (p) {
				if (inBounds(p)) {
					p.render(gfx);
				}
			});


			if (this.state.is("CRASHED")) {
				c.fillStyle = "hsl(" + (Math.random() * 100 | 0) + ",70%,50%)";
				c.fillRect(player.x + Ω.utils.rand(-10, 20), player.y + Ω.utils.rand(-10, 20), 20, 20);
			} else {
				//player.checkGroundCol(gfx);
				player.render(gfx);
			}

			c.restore();

		},

		setMessage: function (message, blinkTime, revertAfterBlink) {
			this.message_last = revertAfterBlink ? this.message : "";
			this.message = message;
			this.message_blink = blinkTime || 200;

		},

		fareSelected: function () {
			this.setMessage("Pickup from: " + this.screen.fare.src.name);
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx,
				player = this.player_craft,
				xoff = gfx.w - 200,
				yoff = 20;

			var mmw = 200,
				mmh = 160,
				mmx = gfx.w - mmw - 20,
				mmy = gfx.h - mmh - 20,
				mmxr = 0.09,
				mmyr = 0.09;

			c.fillStyle = "rgba(63, 63, 63, 0.3)";
			c.beginPath();
			c.arc(mmx + (mmw / 2), mmy + (mmh / 2) - 20, mmw / 2, 0, Math.PI * 2, false);
			c.closePath();
			c.fill()

			c.fillStyle = "#fff";
			c.fillRect(mmw / 2 + mmx, mmh / 2 + mmy, 4, 4);

			this.planets.forEach(function (p) {
				var dx = (p.x - player.x) * mmxr,
					dy = (p.y - player.y) * mmyr;
				if (Math.abs(dx) > 100 || Math.abs(dy) > 80) {
					return;
				}

				if (p.isDepot) {
					c.beginPath()
					c.arc(dx + mmx + mmw / 2 + 3, dy + mmy + mmh / 2 + 3, 4, 0, Math.PI * 2, false)
					c.strokeStyle = p.col;
					c.stroke();
				} else {
					c.fillStyle = p.col;
					c.fillRect(
						dx + mmx + mmw / 2, 
						dy + mmy + mmh / 2, 
						5, 5);
				}
			});

			var fare = this.screen.fare;
			if (fare) {
				var planet = fare.pickedUp ? fare.dest : fare.src;
				var angle = Ω.math.angleBetween(planet, this.player_craft),
					xoff = gfx.w - 100 - 20,
					yoff = gfx.h - 100 - 20;
				c.save();
				c.translate(xoff, yoff);
				c.rotate(angle);

				c.fillStyle = "#fff";
				c.beginPath();
				c.moveTo(-10, -6);
				c.lineTo(-10, 6);
				c.lineTo(10, 0);
				c.closePath();

				c.fill();
				c.translate(-xoff, -yoff)
				c.restore();
			}

		},

		renderFares: function (gfx) {
			var c = gfx.ctx,
				xoff = 20,
				yoff = 60,
				w = 196,
				h = 200;

			c.strokeStyle = "#666";
			c.strokeRect(xoff - 8, yoff - 16, w, h);

			c.fillStyle = "#fff";

			c.fillText("GüBer cred: [X] " + this.player.guber_cred, xoff, yoff - 30);
			c.fillText("-AVAILABLE FARES-", xoff +10, yoff);

			this.screen.fares.forEach(function (fare, i) {
				c.font = "8pt monospace";
				c.fillStyle = fare.selected ? "#411" : "#333";
				c.fillRect(xoff, i * 40 + yoff + 5, 180, 35);

				c.fillStyle = "#999";
				c.fillText((i + 1) +")", xoff + 10, i * 40 + yoff + 20);
				c.font = "30pt monospace";
				c.fillText("☠☠☠", xoff + 10, i * 40 + yoff + 35);
			});

			yoff += 210;
			c.fillStyle = "#fff"
			c.font = "12pt monospace";
			c.fillText("- DISPATCH -", xoff, yoff);
			if (this.message) {
				if (this.message_blink-- <= 0 || Ω.utils.toggle(300, 2)) {
					c.fillText(this.message, xoff, yoff + 30);
				}
				if (this.message_blink === 0 && this.message_last) {
					this.message = this.message_last;
				}
			}
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Asteroids = Asteroids;
	
}());
