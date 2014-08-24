(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        hour: 0,
        frame: data.framesPerHour - 100,

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
            var pressedIdx = -1;
            if (Ω.input.pressed("one")) {
                pressedIdx = 0;
            }
            if (Ω.input.pressed("two")) {
                pressedIdx = 1;
            }
            if (Ω.input.pressed("three")) {
                pressedIdx = 2;
            }
            if (Ω.input.pressed("four")) {
                pressedIdx = 3;
            }
            if (pressedIdx > -1) {
                if (this.fares[pressedIdx]) {
                    var fare = this.fares[pressedIdx];
                    if (fare === this.selected) {
                        fare.selected = false
                        this.selected = null;
                    } else {
                        fare.selected = true;
                        if (this.selected) {
                            this.selected.selected = false;
                        }
                        this.selected = fare;
                    }
                }
            }

            this.level.tick();
        },

        addHour: function () {

            this.hour++;

            var planets = this.levels.asteroids.planets;

            if (this.fares.length < 5)
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
            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 10%)");
            c.font = "16pt monospace";

            this.level.render(gfx);

            c.fillStyle = "#fff";
            c.fillText(this.hour, 30, 200);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
