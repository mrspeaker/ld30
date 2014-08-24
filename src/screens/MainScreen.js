(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        hour: 0,
        frame: data.framesPerHour - 100,

        fares: null,
        fare: null,

        init: function () {

            this.fares = [];
            this.player = new Player();

            this.levels = {
                asteroids: new Levels.Asteroids(this)
            }
            this.level = this.levels.asteroids;
            data.physics = data.physics_space;

        },

        tick: function () {

            if (this.frame % 1000 == 0) {
                this.addHour();
            }

            // Move this to Asteroids.
            if (this.level === this.levels.asteroids) {
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
                    if (this.fare && this.fare.pickedUp) {
                        this.levels.asteroids.setMessage("FARE IN PROGRESS!")
                    } else if (this.fares[pressedIdx]) {
                        var fare = this.fares[pressedIdx];
                        if (fare === this.fare) {
                            fare.selected = false
                            this.fare = null;
                        } else {
                            fare.selected = true;
                            if (this.fare) {
                                this.fare.selected = false;
                            }
                            this.fare = fare;
                            this.level.fareSelected();
                        }
                    }
                }
            }

            this.level.tick();
        },

        doneFare: function (fare) {
            fare.selected = false;
            this.fare = null;
            this.fares = this.fares.filter(function (f) {
                return f !== fare;
            });
            this.levels.asteroids.setMessage("Select fare [1-4]"); 
        },

        pickedUpFare: function (fare) {
           fare.pickedUp = true;
           this.levels.asteroids.setMessage("Drop off at:" + fare.dest.name);
        },

        addHour: function () {

            this.hour++;

            var planets = this.levels.asteroids.planets;

            if (this.fares.length < 4) {
                var src = planets[Ω.utils.rand(planets.length - 2)],
                    dst = planets[Ω.utils.rand(planets.length - 2)],
                    src_pad = Ω.utils.rand(src.surface.pads),
                    dst_pad = Ω.utils.rand(dst.surface.pads);

                this.fares.push({
                    src: src,
                    src_pad: src_pad,
                    dest: dst,
                    dest_pad: dst_pad,
                    bid: Ω.utils.rand(1000, 4000),
                    tips: Ω.utils.rand(3000),
                    pickedUp: false
                });
            }

        },

        goto: function (level, planet) {
            switch(level) {
            case "land":
                data.physics = data.physics_planet;
                this.level = new Levels.LunarLander(planet, this);
                break;
            case "fly":
                data.physics = data.physics_space;
                this.level = this.levels.asteroids;
                this.level.depart(planet);
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

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
