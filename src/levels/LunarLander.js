(function () {

	"use strict";

	var LunarLander = Ω.Class.extend({

		scale: 1,

		loaded: false,

		state: null,
		landed_y: null,

		stars: null,
		numstars: 200,

		audio: {
			collect: new Ω.Sound("res/audio/collect", 0.8),
			crash: new Ω.Sound("res/audio/crash", 0.8)
		},

		init: function (planet, screen) {

			var self = this;

			this.state = new Ω.utils.State("BORN");

			this.planet = planet;
			this.planet.visits++;
			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
			this.stars = [];
			this.fare = screen.fare;

			// Don't need this now, 'cuase  not loading multiple in one.
			var res = screen.levelData ? screen.levelData.raw : "res/surfaces/" + planet.surface.name + ".svg?" + Date.now();

			new Ω.SVGLevel(res, "#" + planet.surface.name, function (level, err) {
				if (err) {
					console.log("Error loading surface:", err);
					return;
				}

				self.loaded = true;
				self.parse(level);
				self.addStars();

			});

		},


		parse: function (level) {
			var self = this;

			this.surface = level.layer("Surface").data || [];
			this.shadows = level.layer("Shadows").data || [];
			this.leaves = (level.layer("Triggers").data || []).map(function (trig, i) {
				return trig;
			});
			this.bg = level.layer("Background").data || [];
			this.pads = (level.layer("Pads").data || []).reverse().map(function (pad, i) {
				pad.id = i;
				pad.hit = function (player) {
					self.checkLanding(this, player);
				}
				return pad;
			});
			var spawns = level.layer("Spawns");
			if (spawns) {
				var spawn = spawns.data[0];
				if (spawn) {
					this.player_craft.x = spawn.x;
					this.player_craft.y = spawn.y;
				}
			}

			this.level = level;
		},

		addStars: function () {
			for (var i = 0; i < this.numstars; i++) {
				this.stars.push([
					Ω.utils.rand(0, this.level.w),
					Ω.utils.rand(-300, this.level.h)
				]);
			}
		},

		tick: function () {

			if (!this.loaded) return;

			var craft = this.player_craft;

			this.state.tick();
			switch(this.state.get()) {
			case "BORN":
				this.state.set("INTRO");
				break;
			case "INTRO":
				if (this.state.count > 100) {
					this.state.set("FALLING");
				}
				break;
			case "FALLING":
				if (this.landed_y && this.landed_y !== craft.y) {
					this.landed_y = null;
				}
				this.tick_falling();
				break;
			case "LANDED":
				if (this.state.first()) {
					var rotation = craft.rotation,
						velocity = craft.vtotal;

					var rated = this.rateLanding(rotation, velocity);

					craft.halt();
					craft.rotation = 0;
					this.landed_y = craft.y;

					var fare = this.screen.fare;
					if (fare) {
						if (fare.pickedUp) {
							if (fare.dest === this.planet) {
								// DONE THE FARE!
								this.audio.collect.play();
								rated = (fare.rated + rated) / 2;
								fare.credEarned = rated * fare.difficulty * 1000 | 0;
								this.player.guber_cred += fare.credEarned;
								this.player.ranking = this.screen.getRanking();
								
								game.setDialog(new EarnedDialog(rated, fare, this.player));
								this.screen.doneFare();
								this.screen.setMessage("Earned " + fare.credEarned + " GüBer cred");
							}
						} else {
							if (fare.src === this.planet) {
								// Picked up.								
								this.screen.pickedUpFare(fare);
								this.audio.collect.play();
								// Save pickup rating
								fare.rated = rated;
							}
						}
					} else {
						this.screen.setMessage("Nice. Now get back to work!");
					}
				}
				if (this.state.count > 100) {
					this.state.set("FALLING");
				}
				break;
			case "CRASHED":
				if (this.state.first()) {
					craft.crashed = true;
					this.player.guber_cred = Math.max(0, this.player.guber_cred - data.cash.uberRankReduceOnCrash);
					this.player.cash = Math.max(0, this.player.cash - data.cash.cabPrice);
					this.screen.doneFare();
					this.audio.crash.play();
				}
				if (this.state.count > 100) {
					this.screen.goto("fly", this.planet);
				}
				break;
			case "LEAVING":
				this.screen.goto("fly", this.planet);
				break;
			}
		},

		tick_falling: function () {
			var player = this.player_craft;

			// Set the camera scale
			this.scale = 0.7 + (Math.max(0, 2 - player.vtotal / 2) / 6);

			if (player.crashed) {
				this.state.set("CRASHED");
				return;
			}
			
			this.stats = {
				rot: Math.abs(player.rotation) <= data.landing.max_rot,
				vel: player.vtotal <= data.landing.max_velocity
			}

			this.player_craft.tick(this.landed_y === null ? data.physics.gravity : 0);
			
			// Removed fuel from the game
			/*if (this.player_craft.thrust > 0) {
				this.player.fuel -= this.player_craft.thrust;
				if (this.player.fuel < 0) {
					//
				}
			}*/

			Ω.Physics.checkCollision(this.player_craft, this.pads);
			Ω.Physics.checkCollision(this.player_craft, this.leaves, "leave");
		},

		leave: function () {
			this.state.set("LEAVING");
		},

		checkLanding: function (pad, player) {
			if (pad.alreadyLanded) {
				player.halt();
				player.y = pad.y - player.h;
				return;
			}

			var landed = true;
			if (player.x < pad.x) {
				landed = false;
			}
			if (player.x + player.w > pad.x + pad.w) {
				landed = false;
			}
			if (!this.stats.rot) {
				landed = false;
			}
			if (!this.stats.vel) {
				landed = false;
			}
			if (landed) {
				this.state.set("LANDED");
				pad.alreadyLanded = true;
			} else {
				this.state.set("CRASHED");
			}
		},

		rateLanding: function(rot, vel) {
			var rotRank = 1 - ((Math.abs(rot) * 0.6) / data.landing.max_rot),
				velRank = 1 - ((vel * 0.45) / data.landing.max_velocity);

			rotRank = Ω.math.clamp(rotRank, 0, 1);
			velRank = Ω.math.clamp(velRank, 0, 1);

			return (rotRank + velRank) / 2;
		},

		render: function (gfx) {

			if (!this.loaded) return;

			var c = gfx.ctx,
				self = this;
			c.save();

			var scale = this.scale,
			    player = this.player_craft;

			c.scale(scale, scale);
			c.translate(
			    -player.x + ((gfx.w / 2) / scale),
			    -player.y + ((gfx.h / 2) / scale)
			);

			c.fillStyle = "#999";
			this.stars.forEach(function (s) {			
				/*if (s[0] < left || s[0] > right) {
					return;
				}
				if (s[1] < top || s[1] > bottom) {
					return;
				}*/
				c.fillRect(s[0], s[1], 3, 3);
			});

			c.fillStyle = "hsl(40, 40%, 10%)";
			this.bg.forEach(function (ground) {
				var polyline = ground.path;
				ground.x = 0;
				ground.y = 0;
				c.beginPath();
				c.moveTo(ground.x + polyline[0].x, ground.y + polyline[0].y);
				polyline.slice(1).forEach(function (p) {
					c.lineTo(ground.x + p.x, ground.y + p.y);
				});
				c.closePath();
				c.fill();
			});
			
			c.fillStyle = data.collision;
			this.surface.forEach(function (ground) {
				var polyline = ground.path;
				ground.x = 0;
				ground.y = 0;
				c.beginPath();
				c.moveTo(ground.x + polyline[0].x, ground.y + polyline[0].y);
				polyline.slice(1).forEach(function (p) {
					c.lineTo(ground.x + p.x, ground.y + p.y);
				});
				c.closePath();
				
				c.fill();
			});

			c.fillStyle = "hsl(20, 50%, 30%)";
			this.shadows.forEach(function (ground) {
				var polyline = ground.path;
				ground.x = 0;
				ground.y = 0;
				c.beginPath();
				c.moveTo(ground.x + polyline[0].x, ground.y + polyline[0].y);
				polyline.slice(1).forEach(function (p) {
					c.lineTo(ground.x + p.x, ground.y + p.y);
				});
				c.closePath();
				c.fill();
			});

			this.pads.forEach(function (pad, i) {
				var fare = self.screen.fare,
					rightPlanet = false,
					rightPad = -1;
				
				// Are we in teh right planet for dropping off/picking up?
				if (fare) {
					if ((fare.src === self.planet && !fare.pickedUp) || (fare.dest === self.planet && fare.pickedUp)) {
						rightPlanet = true;
						rightPad = fare.src === self.planet ? fare.src_pad : fare.dest_pad;
					}
				}
				if (rightPlanet && i === rightPad ) {
					self.rightPad = pad;
				}

				if (rightPlanet && i === rightPad && Ω.utils.toggle(200, 2)) {
					c.fillStyle = "hsl(200, 70%, 30%)";					
				} else {
					c.fillStyle = pad.alreadyLanded ? "hsl(200, 70%, 30%)" : "hsl(200, 70%, 60%)";
				}
				c.fillRect(pad.x, pad.y, pad.w, pad.h);
				c.fillText(i + 1, pad.x + pad.w / 2, pad.y + 30);
			});

			if (this.state.isIn("INTRO", "FALLING")) {
				player.checkGroundCol(gfx);
				player.render(gfx);
			}
			if (this.state.is("LANDED") && Ω.utils.toggle(200, 2)) {
				player.render(gfx);
			}
			if (this.state.is("CRASHED")) {
				c.fillStyle = "hsl(" + (Math.random() * 100 | 0) + ",70%, 50%)";
				c.fillRect(player.x + Ω.utils.rand(-10, 20), player.y + Ω.utils.rand(-10, 20), 20, 20);

				c.fillStyle = "hsl(" + (Math.random() * 100 | 0) + ",70%, 50%)";
				c.fillRect(player.x + Ω.utils.rand(-20, 40), player.y + Ω.utils.rand(-20, 40), 10, 10);
			}

			c.restore();

			gfx.ctx.font = "12pt monospace";			
			this.renderHUD(gfx);
			gfx.ctx.font = "16pt monospace";
			
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx,
				player = this.player_craft,
				xoff = 20,
				yoff = 60,
				w = 196;

			var mmw = 200,
				mmh = 160,
				mmx = gfx.w - mmw - 20,
				mmy = gfx.h - mmh - 40,
				mmxr = 0.09,
				mmyr = 0.09;

			c.fillStyle = "rgba(63, 63, 63, 0.3)";
			c.beginPath();
			c.arc(mmx + (mmw / 2), mmy + (mmh / 2), 60, 0, Math.PI * 2, false);
			c.closePath();
			c.fill();

			// Dispatch background
			c.fillRect(xoff - 8, yoff - 16, w, 20);

			c.strokeStyle = "#666";
			c.strokeRect(xoff - 8, yoff - 16, w, 20);
			c.fillStyle = "#999"
			c.fillText("- DISPATCH -", xoff + 40, yoff - 1);

			var ranking = this.screen.getRanking();

			c.fillStyle = "#fff";
			c.fillText("GüBer cred: " + this.player.guber_cred + " (" + ranking[1] + ")", xoff - 6, yoff - 33);
			
			if (this.screen.message) {
				if (this.screen.message_blink-- <= 0 || Ω.utils.toggle(300, 2)) {
					c.fillText(this.screen.message, xoff - 6, yoff + 30);
				}
				if (this.screen.message_blink === 0 && this.screen.message_last) {
					this.screen.message = this.screen.message_last;
				}
			}

			xoff = mmx + mmw / 2 - 30;
			yoff = mmy + mmh / 2 - 5;

			if (this.stats && this.state.isIn("FALLING", "LANDED")) {
				//c.fillText("VEL", xoff, yoff - 20);
				//c.fillText("ROT", xoff, yoff + 40);

				var vel = ((this.stats.vel || Ω.utils.toggle(100, 2)) ? "70%, 30%" : "90%, 50%"),
					rot = ((this.stats.rot || Ω.utils.toggle(100, 2)) ? "70%, 30%" : "90%, 50%");
				/*c.fillStyle = "hsl(0, " + vel + ")";
				c.beginPath();
				c.arc(xoff + 45, yoff - 4 - 20, 7, 0, Math.PI * 2, false);
				c.fill();

				c.fillStyle = "hsl(120, " + rot + ")";
				c.beginPath();
				c.arc(xoff + 45, yoff + 16 +20 , 7, 0, Math.PI * 2, false);
				c.fill();*/

				xoff += 28;
				yoff += 10;

				if (this.rightPad && !this.rightPad.alreadyLanded) {
					var angle = Ω.math.angleBetween(this.rightPad, this.player_craft);

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
			}
		}
	});

	window.Levels = window.Levels || {};
	window.Levels.LunarLander = LunarLander;
	
}());
