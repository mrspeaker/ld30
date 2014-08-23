(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        init: function () {

            this.player = new Player();

            this.levels = {
                asteroids: new Levels.Asteroids(this)
            }
            this.level = this.levels.asteroids;

        },

        tick: function () {

            this.level.tick();
        },

        goto: function (level, planet) {
            switch(level) {
            case "land":
                this.level = new Levels.LunarLander(planet, this);
                break;
            case "fly":
                this.level = this.levels.asteroids;
                this.level.depart();
                break;
            case "depot":
                this.level = new Levels.Depot(planet, this)
                break;
            }
        },

        render: function (gfx) {

            this.clear(gfx, "hsl(195, 40%, 10%)");
            gfx.ctx.font = "16pt monospace";

            this.level.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
