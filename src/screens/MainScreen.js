(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        isGravity: true,
        level: null,

        init: function () {

            this.player = new Player();

            this.levels = {
                asteroids: new Levels.Asteroids(this)
            }
            this.level = this.levels.asteroids;

        },

        tick: function () {

            if (Ω.input.pressed("space")) {
                this.isGravity = !this.isGravity;
            }
            this.level.tick();
        },

        goto: function (level, id) {
            switch(level) {
            case "land":
                this.level = new Levels.LunarLander(id, this);
                break;
            case "fly":
                this.level = this.levels.asteroids;
                this.level.depart();
                break;
            case "depot":
                this.level = new Levels.Depot(id, this)
                break;
            }
        },

        render: function (gfx) {

            this.clear(gfx, "hsl(195, 40%, 10%)");

            this.level.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
