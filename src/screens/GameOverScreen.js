(function (Ω) {

    "use strict";

    var GameOverScreen = Ω.Screen.extend({

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

            gfx.ctx.fillText("Game Over", gfx.w / 2 - 260, gfx.h * 0.4);
			gfx.ctx.font = "16pt monospace";
            gfx.ctx.fillText("With no cash, and no connection", gfx.w / 2 - 230, gfx.h * 0.7);
            gfx.ctx.fillText("you can't survive in these worlds.", gfx.w / 2 - 130, gfx.h * 0.78);

        }
    });

    window.GameOverScreen = GameOverScreen;

}(window.Ω));
