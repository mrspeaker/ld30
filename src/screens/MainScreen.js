(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        hour: 0,
        frame: data.framesPerHour / 2,

        fares: null,

        init: function () {

            this.fares = [];
            this.player = new Player();

            this.levels = {
                asteroids: new Levels.Asteroids(this)
            }
            this.level = this.levels.asteroids;

        },

        tick: function () {

            if (this.frame % 1000 == 0) {
                this.addHour();
            }

            if (Ω.input.pressed("one")) {
                if (this.fares[0]) {
                    this.selected = null;
                    this.fares[0].selected = !this.fares[0].selected;
                    this.selected = this.fares[0];
                }
            }

            this.level.tick();
        },

        addHour: function () {

            this.hour++;

            var planets = this.levels.asteroids.planets;

            this.fares.push({
                src: planets[Ω.utils.rand(planets.length - 2)],
                dest: planets[Ω.utils.rand(planets.length - 2)],
                bid: Ω.utils.rand(1000, 4000),
                tips: Ω.utils.rand(3000)
            });

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

            gfx.ctx.fillStyle = "#fff";
            gfx.ctx.fillText(this.hour, 30, 200);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
