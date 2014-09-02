(function (Ω) {

    "use strict";

    var IntroScreen = Ω.Screen.extend({

        init: function () {

        },

        tick: function () {
            if (this.frame > 50) {
                if (Ω.input.pressed("space") || 
            	    Ω.input.pressed("moused") || 
            		Ω.input.pressed("up") || 
            		Ω.input.pressed("down") || 
            		Ω.input.pressed("left") || 
            		Ω.input.pressed("right")) {
            			game.setScreen(new MainScreen());
            	}
            }
        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");
            c.font = "48pt monospace";

            c.fillStyle = data.colors.theYellow;

            c.fillText("G B r  a i ", gfx.w / 2 - 260, gfx.h * 0.3 + Math.sin(Date.now() / 400) * 5);
            c.fillText(" ü E  T x s", gfx.w / 2 - 260, gfx.h * 0.3);

			c.font = "16pt monospace";
            c.fillText("Connecting worlds,", gfx.w / 2 - 250, gfx.h * 0.75);
            c.fillText("in disconnected times.", gfx.w / 2 - 120, gfx.h * 0.82);

            c.fillStyle = "#888";
            c.fillText("Controls  : arrows / WSAD", gfx.w / 2 - 200, gfx.h * 0.5);
            c.fillText("Take fare : 1 - 4 [or mouse]", gfx.w / 2 - 200, gfx.h * 0.55);

            c.fillStyle = "#555";
            c.fillText("- Mr Speaker", gfx.w - 180, gfx.h - 20);

            // Draw the player

            var x = 320,
                y = 50,
                w = 32,
                rotation = 45,
                h = 24,
                rotation_point = [w * 0.5, h * 0.5]; // center

            c.save();
            c.scale(2, 2);
            c.translate(x + rotation_point[0], y + rotation_point[1]);
            c.rotate(rotation * Math.PI / 180);
            c.translate(-rotation_point[0], -rotation_point[1]);

            c.strokeStyle = "#999";
            c.beginPath();
            c.arc(w / 2 + 0, 5, w / 2 - 3, 0, Math.PI, true);
            c.stroke();

            c.fillStyle = "#333";
            c.fillRect(0, 0, w, h);
            c.fillStyle = data.colors.theYellow;
            c.fillRect(4, h, w - 8, 4);
            c.fillRect(8, h + 4, w - 16, 2);
            c.fillRect(-1, h - 7, 3, 11);
            c.fillRect(w - 1, h - 7, 3, 11);
            
            c.restore();
        }
    });

    window.IntroScreen = IntroScreen;

}(window.Ω));
