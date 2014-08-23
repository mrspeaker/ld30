(function (Ω) {

    "use strict";

    var PlayerCraft = Ω.Entity.extend({
        w: 32,
        h: 24,

        vr: 0,
        thrust: 0,
        vx: 0,
        vy: 0,

        friction: 0.99,

        rotation: 0,

        crashed: false,

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;

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
        },
        
        tick: function (gravity) {

            if (Ω.input.isDown("left")) {
                this.vr = -1;
            }
            if (Ω.input.isDown("right")) {
                this.vr = 1;
            }
            if (Ω.input.released("left") || Ω.input.released("right")) {
                this.vr = 0;
            }

            if (Ω.input.isDown("up")) {
                this.thrust = 0.1;
            }
            if (Ω.input.isDown("down")) {
                this.thrust = 0;
            }
            if (Ω.input.released("up") || Ω.input.released("down")) {
                this.thrust = 0;
            }
            
            this.rotation += this.vr;

            var angle = (this.rotation - 90) * Math.PI / 180;
            var ax = Math.cos(angle) * this.thrust;
            var ay = Math.sin(angle) * this.thrust;

            this.vx += ax;
            this.vy += ay + gravity;

            this.vx *= this.friction;
            this.vy *= this.friction;

            this.x += this.vx;
            this.y += this.vy;

            this.calculateCollisionPoints((this.rotation) * Math.PI / 180, this.rotation_point)

            return true;

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
                    var imgd = ctx.getImageData(
                            ((p[0] - self.x) * scale) + (gfx.w / 2), 
                            ((p[1] - self.y) * scale) + (gfx.h / 2), 
                            1, 
                            1);
                    if (imgd.data[0] === 136) {
                        self.crashed = true;
                    }
                });

        },

        render: function (gfx) {

            var c = gfx.ctx;
            c.save();
            c.fillStyle = "#333";

            c.translate(this.x + this.rotation_point[0], this.y + this.rotation_point[1]);
            c.rotate(this.rotation * Math.PI / 180);
            c.translate(-this.rotation_point[0], -this.rotation_point[1]);

            c.fillRect(0, 0, this.w, this.h);

            c.restore();

            //Show bounding box - useful to see how the rotated hitpoints work.
            c.fillStyle = "rgba(255, 255, 255, 1)";
            this.points.forEach(function (p) {
                c.fillRect(p[0], p[1], 1, 1);
            });
            c.fillStyle = "#fff";
            c.fillRect(this.rotation_point[0] + this.x - 1, this.rotation_point[1] + this.y -1, 3, 3);

        }

    });

    window.PlayerCraft = PlayerCraft;

}(window.Ω));