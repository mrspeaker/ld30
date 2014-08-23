(function () {

	"use strict";

	var LunarLander = Ω.Class.extend({

		scale: 1,

		loaded: false,

		state: null,

		init: function (planet, screen) {

			this.state = new Ω.utils.State("BORN");

			this.planet = planet;
			this.screen = screen;
			this.player = screen.player;
			this.player_craft = new PlayerCraft(Ω.env.w * 0.5, Ω.env.h * 0.2, this);

			this.planet.visits++;
			
			this.loaded = false;

			var self = this;
			new Ω.Tiled("res/surfaces/" + planet.surface + ".json?" + Date.now(), function (level, err) {
				if (err) {
					console.log("Error loading surface:", err);
					return;
				}

				self.loaded = true;
				self.parse(level);

			});

		},

		parse: function (level) {

			var self = this;
			
			this.surface = level.layer("surface").type("ground");
			this.pads = level.layer("pads").type("pad").map(function (pad) {
				pad.height = 10;
				pad.y -= pad.height;
				pad.w = pad.width;
				pad.h = pad.height;
				pad.hit = function (player) {
					self.checkLanding(this, player);
				}
				return pad;
			});

		},

		tick: function () {

			if (!this.loaded) return;

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
				this.tick_falling();
				break;
			case "LANDED":
				if (this.state.first()) {
					this.player_craft.halt();
					this.player_craft.rotation = 0;
					// TODO: "judge" landing
					this.player.guber_rank += Math.random() * 10 | 0;
					this.player.cash += (Math.random() * 3000 | 0) + 900;
				}
				if (this.state.count > 100) {
					this.screen.goto("fly");
				}
				break;
			case "CRASHED":
				if (this.state.first()) {
					this.player_craft.crashed = true;
					this.player.guber_rank = Math.max(0, this.player.guber_rank - 20);
					this.player.cash -= 10000;
				}
				if (this.state.count > 100) {
					this.screen.goto("fly");
					if (this.player.cash < 0) {
						this.player.cash = 0;
						game.setScreen(new GameOverScreen());
					}
				}
				break;
			}
		},

		tick_falling: function () {
			var player = this.player_craft;
				//vel = Math.sqrt(player.vx * player.vx + player.vy * player.vy);

			this.scale = 0.7 + (Math.max(0, 2 - player.vtotal / 2) / 6);//Math.sin(Date.now() / 1000) * 0.003;

			if (player.crashed) {
				this.state.set("CRASHED");
				return;
			}
			
			// TODO: only enforce on edges of screen or much higher
			if (player.y < -25) {
			    this.screen.goto("fly");
			    return;
			}

			this.stats = {
				rot: Math.abs(player.rotation) <= data.landing.max_rot,
				vel: player.vtotal <= data.landing.max_velocity
			}

			this.player_craft.tick(data.physics.gravity);
			if (this.player_craft.thrust > 0) {
				this.player.fuel -= this.player_craft.thrust;
				if (this.player.fuel < 0) {
					//
				}
			}

			Ω.Physics.checkCollision(this.player_craft, this.pads);
		},

		checkLanding: function (pad, player) {
			var landed = true;
			if (player.x < pad.x) {
				landed = false;
				console.log("nope", player.x, pad.x)
			}
			if (player.x + player.w > pad.x + pad.w) {
				landed = false;
				console.log("n2", player.x + player.w, pad.x + pad.w)
			}
			if (!this.stats.rot) {
				console.log("norot", player.rotation.toFixed(2));
				landed = false;
			}
			if (!this.stats.vel) {
				console.log("no vy!", player.vy.toFixed(2));
				landed = false;
			}
			if (landed) {
				this.state.set("LANDED");
			} else {
				this.state.set("CRASHED");
			}
		},

		render: function (gfx) {

			if (!this.loaded) return;

			var c = gfx.ctx;
			c.save();

			var scale = this.scale,
			    player = this.player_craft;

			c.scale(scale, scale);
			c.translate(
			    -player.x + ((gfx.w / 2) / scale),
			    -player.y + ((gfx.h / 2) / scale)
			);

			c.fillStyle = data.collision;
			this.surface.forEach(function (ground) {
				var polyline = ground.polyline;
				c.beginPath();
				c.moveTo(ground.x + polyline[0].x, ground.y + polyline[0].y);
				polyline.slice(1).forEach(function (p) {
					c.lineTo(ground.x + p.x, ground.y + p.y);
				});
				c.closePath();
				c.fill();
			});

			c.fillStyle = "hsl(200, 70%, 60%)";
			this.pads.forEach(function (pad) {
				c.fillRect(pad.x, pad.y, pad.width, pad.height);
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
			}

			c.restore();

			gfx.ctx.font = "12pt monospace";			
			this.renderHUD(gfx);
			gfx.ctx.font = "16pt monospace";
			
		},

		renderHUD: function (gfx) {

			var c = gfx.ctx,
				player = this.player_craft;

			c.fillStyle = "#fff";
			c.fillText("GüBER RANK : " + this.player.guber_rank, 20, 30);
			c.fillText("CASH FUNDS : " + "¥" + this.player.cash, 20, 50);
			
			if (this.state.isIn("BORN", "INTRO")) {
				c.fillText("READY", gfx.w / 2 - 40, gfx. h / 2 - 100)
			}

			if (this.stats && this.state.isIn("FALLING", "LANDED")) {
				c.fillText("FUEL       : " + (this.player.fuel | 0), 20, 70);
				c.fillText("VELOCITY   : " + (player.vtotal * 80).toFixed(1), 20, 90);
				c.fillText("ROTATION   : " + (player.rotation).toFixed(1), 20, 110);

				var vel = ((this.stats.vel || Ω.utils.toggle(100, 2)) ? "70%, 30%" : "90%, 50%"),
					rot = ((this.stats.rot || Ω.utils.toggle(100, 2)) ? "70%, 30%" : "90%, 50%");
				c.fillStyle = "hsl(0, " + vel + ")";
				c.beginPath();
				c.arc(130, 84, 7, 0, Math.PI * 2, false);
				c.fill();

				c.fillStyle = "hsl(120, " + rot + ")";
				c.beginPath();
				c.arc(130, 104, 7, 0, Math.PI * 2, false);
				c.fill();
			}

		}
	});

	window.Levels = window.Levels || {};
	window.Levels.LunarLander = LunarLander;
	
}());
