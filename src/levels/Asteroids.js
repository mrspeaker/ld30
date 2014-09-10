(function () {

	"use strict";

	var Asteroids = Ω.Class.extend({

		scale: 0.8,
		planets: null,

		numstars: 500,
		stars: null,

		doneIntro: false,
		state: null,

		audio: {
			theme: new Ω.Sound("res/audio/theme", 0.5, 1)
		},

		themeStarted: false,
		baddies: null,

		init: function (screen) {

			this.state = new Ω.utils.State("BORN");

			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
			this.baddies = [];

			var ok = false,
				loops = 0;
			// Try and space out all the planets
			while (!ok) {
				this.planets = [];
				var maxPlanets = 12;
				for (var i = 0; i < maxPlanets; i++) {
					var p = new Planet(
						i,
						data.names.planets[i],
						Ω.utils.rand(data.starSystem.minx, data.starSystem.maxx),
						Ω.utils.rand(data.starSystem.miny, data.starSystem.maxy),
						Ω.utils.rand(25, 45),
						i == maxPlanets - 1);
					this.planets.push(p);
				}

				var all = this.planets.slice(0),
					err = "",
					minDist = 9999;
				all.push(this.player_craft);

				for (var j = 0; j < all.length; j++) {
					for (i = 0; i < all.length; i++) {
						var a = all[j],
							b = all[i];
						if (a === b) {
							break;
						}
						var dist = Ω.math.dist(a, b);
						if (dist < minDist) {
							minDist = dist;
						}
					}
				}

				loops++
				if (minDist > 400 || loops > 50) {

					ok = true;
				}
			}

			if (data.debug.gimmePlanet) {
				this.planets[1].x = this.player_craft.x;
				this.planets[1].y = this.player_craft.y - 200;
			}

			this.stars = [];
			for (i = 0; i < this.numstars; i++) {
				this.stars.push([
					Ω.utils.rand(data.starSystem.minx, data.starSystem.maxx),
					Ω.utils.rand(data.starSystem.miny, data.starSystem.maxy)
				]);
			}
		},

		pickupFare: function (fare) {
			console.log("ya!");
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
				this.screen.setMessage(this.screen.selectMessage);
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
					//this.audio.theme.play();
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
			var player = this.player_craft,
				screen = this;
			for (var i = 0; i < this.planets.length; i++) {
				var p = this.planets[i];
				var dist = Ω.math.dist(player, p);
				
				// If close, and not going too fast... LAND!
				if (dist < 50 + p.size) {
					if (player.vtotal < 2) {
						this.state.set("APPROACHING", p);
						return;
					}	
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

			if (Ω.utils.oneIn(400)) {
				this.baddies.push(new BadGuy(
					player.x + Math.random() < 0.5 ? -400 : 400, 
					player.y + Math.random() < 0.5 ? -400 : 400,
					player));
			}

			this.baddies = this.baddies.filter(function (b) {
				return b.tick();
			});
			this.planets = this.planets.filter(function (p) {
				return p.tick(screen, player);
			});
		},

		depart: function (planet) {
			var player = this.player_craft;
			player.halt();
			player.rotation = 0;
			player.enableControls();
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
			if (this.state.is("APPROACHING")) {
				c.fillStyle = "#fff";
				c.fillText("Landing on " + (this.state.data.isDepot ? "The Depot" : this.state.data.name), gfx.w / 2 - 100, 200);
			}
		},

		renderWorld: function (gfx) {

			var c = gfx.ctx;

			var scale = this.scale,
			    player = this.player_craft,
			    midW = ((gfx.w / 2) / scale),
			    midH = ((gfx.h / 2) / scale);

			c.save();
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

			this.baddies.forEach(function (p) {
				if (inBounds(p)) {
					p.render(gfx);
				}
			});


			if (this.state.is("CRASHED")) {
				c.fillStyle = "hsl(" + (Math.random() * 100 | 0) + ",70%,50%)";
				c.fillRect(player.x + Ω.utils.rand(-10, 20), player.y + Ω.utils.rand(-10, 20), 20, 20);
			} else {
				//player.checkGroundCol(gfx);s
				player.render(gfx);
			}

			c.restore();

		},

		renderHUD: function (gfx) {

			var c = gfx.ctx,
				player = this.player_craft,
				xoff = gfx.w - 200,
				yoff = 20;

			// mm == minimap!
			var mmw = 200,
				mmh = 160,
				mmx = gfx.w - mmw - 20,
				mmy = gfx.h - mmh - 40,
				mmxr = 0.09,
				mmyr = 0.09;

			c.fillStyle = "rgba(63, 63, 63, 0.3)";
			c.beginPath();
			c.arc(mmx + (mmw / 2), mmy + (mmh / 2), mmw / 2, 0, Math.PI * 2, false);
			c.closePath();
			c.fill();

			// Fares background
			c.fillRect(20 - 8, 60 - 16, 196, 182);
			c.fillRect(20 - 8, 60 - 16 + 194, 196, 20);

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

			var fare = this.screen.fare,
				showArrow = fare ? true : false;
			if (!fare) {
				if (player.x < -1500 || player.x > 2500 ||
					player.y < -1500 || player.y > 2500) {
					showArrow = true;

					// Fake target in center 
					fare = {
						pickedUp: false,
						src: {
							x: 0,
							y: 0
						}
					}
				}
			}
			if (showArrow) {
				var planet = fare.pickedUp ? fare.dest : fare.src;
				var angle = Ω.math.angleBetween(planet, this.player_craft),
					xoff = mmw / 2 + mmx,
					yoff = mmh / 2 + mmy;
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
			} else {
				c.fillStyle = "#fff";
				c.fillRect(mmw / 2 + mmx, mmh / 2 + mmy, 4, 4);

			}

		},

		renderFares: function (gfx) {
			var c = gfx.ctx,
				xoff = 20,
				yoff = 60,
				w = 196,
				h = 182;

			c.strokeStyle = "#666";
			c.strokeRect(xoff - 8, yoff - 16, w, h);
			c.strokeRect(xoff - 8, yoff - 16 + 194, w, 20);

			var ranking = this.screen.getRanking();

			c.fillStyle = "#fff";
			c.fillText("GüBer cred: " + this.player.guber_cred + " (" + ranking[1] + ")", xoff - 6, yoff - 33);

			c.fillStyle = "#999";			
			c.fillText("-AVAILABLE FARES-", xoff + 8, yoff);
			c.fillText("-DISPATCH-", xoff + 40, yoff + 193);

			this.screen.fares.forEach(function (fare, i) {
				c.font = "8pt monospace";
				c.fillStyle = fare.selected ? "hsl(10, 10%, 35%)" : "#333";
				c.fillRect(xoff, i * 40 + yoff + 5, 180, 35);

				c.fillStyle = "#999";
				c.fillText((i + 1), xoff + 2, i * 40 + yoff + 20);
				c.font = "30pt monospace";
				var stars = Math.max(1, fare.difficulty * 5 | 0);
				for (var j = 0; j < stars; j++) {
					c.fillText("☠", xoff + 20 + j * 28, i * 40 + yoff + 35);
				}

				c.fillStyle = fare.src.col;
				c.fillRect(xoff - 10, i * 40 + yoff + 5, 4, 34);
				c.fillStyle = fare.dest.col;
				c.fillRect(xoff + 186, i * 40 + yoff + 5, 4, 34);
			});

			yoff += 194;
			if (this.screen.message) {
				if (this.screen.message_blink-- <= 0 || Ω.utils.toggle(300, 2)) {
					c.fillStyle = "#fff"
					c.font = "12pt monospace";
					c.fillText(this.screen.message, xoff - 6, yoff + 30);
				}
				if (this.screen.message_blink === 0 && this.screen.message_last) {
					this.screen.message = this.screen.message_last;
				}
			}
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.Asteroids = Asteroids;
	
}());
