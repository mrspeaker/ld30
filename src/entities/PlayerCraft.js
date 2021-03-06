(function (Ω) {

    "use strict";

    var PlayerCraft = Ω.Entity.extend({
        w: 32,
        h: 24,

        vr: 0,
        thrust: 0,
        friction: data.physics.friction,

        vx: 0,
        vy: 0,
        vtotal: 0,

        rotation: 0,
        rthrust: 0,
        rfriction: data.physics.rot_friction,

        rvtotal: 0,

        crashed: false,

        brpoint: null,

        controlsEnabled: true,

        particles: null,

        shield: false,

        passengers: null,

        audio: {
            thrust: new Ω.Sound("res/audio/thrust_noise", 0.7),
            rot_thrust_1: new Ω.Sound("res/audio/thrust_rot_l", 0.7),
            rot_thrust_2: new Ω.Sound("res/audio/thrust_rot_r", 0.7)
        },

        ship: new Ω.Image("res/images/taxi.png"),

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
            this.player = screen.player;
            this.particles = new Ω.Particle({});
            this.passengers = [];

            this.points_init = [
                [0, 0],
                [this.w, 0],
                [0, this.h],
                [this.w, this.h]
            ];
            this.rotation_point = [this.w * 0.5, this.h * 0.5]; // center
            this.points = [];
        },

        halt: function () {
            this.vx = 0;
            this.vy = 0;
            this.thrust = 0;
            this.vr = 0;
            this.rthrust = 0;
        },

        disableControls: function () {
            this.controlsEnabled = false;
        },
        enableControls: function () {
            this.controlsEnabled = true;
        },
        
        tick: function (gravity) {

            var phys = data.physics,
                breakFriction = 1;

            if (this.controlsEnabled) {

                if (Ω.input.isDown("left")) {
                    this.rthrust = -phys.rot_thrust;
                    if (Ω.input.pressed("left")) {
                        this.audio.rot_thrust_1.play(true);
                    }
                }
                if (Ω.input.isDown("right")) {
                    this.rthrust = phys.rot_thrust;
                    if (Ω.input.pressed("right")) {
                        this.audio.rot_thrust_2.play(true);
                    }
                }
                
                if (Ω.input.isDown("up")) {
                    if (Ω.input.pressed("up")) {
                        this.particles.play(this.x, this.y);
                        this.audio.thrust.play(true);
                    }
                    this.thrust = phys.thrust;
                }
                if (Ω.input.isDown("down")) {
                    this.thrust = 0;
                    breakFriction = phys.braking;
                }
            }

            if (Ω.input.released("left") || Ω.input.released("right")) {
                this.rthrust = 0;
            }
            if (Ω.input.released("up") || Ω.input.released("down")) {
                this.thrust = 0;
            }

            
            this.vr += this.rthrust;
            this.vr *= phys.rot_friction * breakFriction;
            this.rotation += this.vr;

            var angle = (this.rotation - 90) * Math.PI / 180;
            var ax = Math.cos(angle) * this.thrust;
            var ay = Math.sin(angle) * this.thrust;

            if (Ω.input.pressed("space")) {
                this.shield = true;
            }
            if (Ω.input.released("space")) {
                this.shield = false;
            }

            this.vx += ax;
            this.vy += ay + phys.gravity;

            var friction = phys.friction;
            this.vx *= friction * breakFriction;
            this.vy *= friction * breakFriction;
            this.vtotal = Ω.math.dist([this.vx, this.vy], [0, 0]); // Calc total velocity

            this.x += this.vx;
            this.y += this.vy;

            this.calculateCollisionPoints((this.rotation) * Math.PI / 180, this.rotation_point);

            this.particles.tick(this.x, this.y);
            
            this.passengers = this.passengers.filter(function (p) {
                return p.e.tick();
            });

            return true;

        },

        leave: function () {
            this.screen.leave();
        },

        calculateCollisionPoints: function (angle, rotation_point) {
            var self = this;
            this.points = this.points_init.map(function (p) {
                var o = Ω.math.rotate(angle, p, rotation_point);
                return [o[0] + self.x, o[1] + self.y];
            });
        },

        checkGroundCol: function (gfx) {
            var ctx = gfx.ctx,
                self = this,
                scale = this.screen.scale,
                pixels = this.points.map(function (p) {
                    var colRgb = data.collisionRgb,
                        pix = ctx.getImageData(
                            ((p[0] - self.x) * scale) + (gfx.w / 2), 
                            ((p[1] - self.y) * scale) + (gfx.h / 2), 
                            1, 
                            1).data;
                    if (pix[0] === colRgb[0] && pix[1] === colRgb[1] && pix[2] === colRgb[2]) {
                        self.crashed = true;
                    }
                    return [pix[0], pix[1], pix[2], pix[3]]
                });
            this.pixels = pixels;
        },

        hit: function (e) {

            if (e instanceof BadGuy) {
                e.remove = true;
                if (!this.shield) {
                    this.vr = (Math.random() < 0.5 ? -1 : 1) * 50;
                }
            }

        },

        render: function (gfx) {

            var c = gfx.ctx;

            if (this.passengers.length) {
                c.beginPath();
                c.moveTo(this.x + this.w / 2, this.y + this.h  / 2);
            }
            this.passengers.forEach(function (p) {
                c.lineTo(p.e.x + p.e.w / 2, p.e.y + p.e.h / 2);
                return p.e.render(gfx);
            });
            if (this.passengers.length) {
                c.stroke();
            }

            c.save();
            c.fillStyle = "#333";

            c.translate(this.x + this.rotation_point[0], this.y + this.rotation_point[1]);
            c.rotate(this.rotation * Math.PI / 180);
            c.translate(-this.rotation_point[0], -this.rotation_point[1]);

            c.strokeStyle = "#999";
            //c.beginPath();
            //c.arc(this.w / 2 + 0, 5, this.w / 2 - 3, 0, Math.PI, true);
            //c.stroke();

            if (this.shield) {
                c.beginPath();
                c.arc(this.w / 2 + 0, 10, this.w * 1.2, 0, Math.PI * 2, true);
                c.stroke();                
            }

            //c.fillRect(0, 0, this.w, this.h);

            this.ship.render(gfx, -6, -20);


            c.fillStyle = "hsl(" + (Math.random() * 70 | 0) + ",70%, 50%)";
            // Lil' thrust light
            if (this.thrust === 0 && this.vtotal > 2) {
                //c.fillRect(4, this.h, this.w - 8, 4);
            }
            if (this.thrust > 0) {
                // Sparkly particles
                c.fillRect((this.w / 2) + Ω.utils.rand(-13, 2), this.h + Ω.utils.rand(-3, 8), 10, 10);
                c.fillRect((this.w / 2) + Ω.utils.rand(-13, 2), this.h + Ω.utils.rand(8, 15), 8, 8);
                c.fillRect((this.w / 2) + Ω.utils.rand(-13, 2), this.h + Ω.utils.rand(15, 25), 5, 5);
            }
            if (this.rthrust > 0) 
                c.fillRect(-1, this.h - 7, 3, 11);
            if (this.rthrust < 0)
                c.fillRect(this.w - 1, this.h - 7, 3, 11);
            
            c.restore();
            
            this.particles.render(gfx);


            //Show bounding box - useful to see how the rotated hitpoints work.
            /*
            c.fillStyle = "rgba(255, 255, 255, 1)";
            this.points.forEach(function (p) {
                c.fillRect(p[0], p[1], 1, 1);
            });
            c.fillStyle = "#fff";
            c.fillRect(this.rotation_point[0] + this.x - 1, this.rotation_point[1] + this.y -1, 3, 3);
            */

        }

    });

    window.PlayerCraft = PlayerCraft;

}(window.Ω));