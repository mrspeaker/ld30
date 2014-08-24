(function (Ω) {

    "use strict";

    var IntroScreen = Ω.Screen.extend({

        init: function () {

        },

        tick: function () {
            if (this.frame > 20) {
            	if (Ω.input.pressed("space") || 
            		Ω.input.pressed("up") || 
            		Ω.input.pressed("down") || 
            		Ω.input.pressed("left") || 
            		Ω.input.pressed("right")) {
            			game.setScreen(new MainScreen());
            	}
            }
        },

        render: function (gfx) {

            this.clear(gfx, "hsl(195, 40%, 10%)");
            gfx.ctx.font = "48pt monospace";

            gfx.ctx.fillStyle = "rgb(191, 188, 21)";

            gfx.ctx.fillText("GüBEr Taxis", gfx.w / 2 - 260, gfx.h * 0.4);
			gfx.ctx.font = "16pt monospace";
            gfx.ctx.fillText("Connecting worlds,", gfx.w / 2 - 230, gfx.h * 0.7);
            gfx.ctx.fillText("in these disconnected times.", gfx.w / 2 - 130, gfx.h * 0.78);

        }
    });

    window.IntroScreen = IntroScreen;

}(window.Ω));
