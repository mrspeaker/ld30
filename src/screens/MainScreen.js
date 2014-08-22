(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        isGravity: true,

        init: function () {

            this.player = new Player(Ω.env.w * 0.5, Ω.env.h * 0.2, this);

            this.scale = 1;

        },

        tick: function () {

            if (this.player.crashed) {
                game.reset();
            }

            if (Ω.input.pressed("space")) {
                this.isGravity = !this.isGravity;
            }

            this.scale += Math.sin(Date.now() / 1000) * 0.006;

            this.player.tick(this.isGravity ? 0.05 : 0);
        },

        render: function (gfx) {

            this.clear(gfx, "hsl(195, 40%, 10%)");

            var c = gfx.ctx;
            c.save();

            var scale = this.scale,
                player = this.player;

            c.scale(scale, scale);
            c.translate(
                -player.x + ((gfx.w / 2) / scale),
                -player.y + ((gfx.h / 2) / scale)
            );

            c.fillStyle = "#800";

            c.fillRect(Ω.env.w / 2 - 100, Ω.env.h - 100, 200, 10);

            c.beginPath();
            c.moveTo(0, 10);
            c.lineTo(50, 150);
            c.lineTo(150, 250);
            c.lineTo(0, 250);
            c.closePath();
            c.fill();

            c.fillRect(0, 230, 400, 10);

            this.player.checkGroundCol(gfx);
            this.player.render(gfx);

            c.restore();

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
