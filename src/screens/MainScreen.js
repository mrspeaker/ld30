(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        hour: 0,

        maxFares: 4,
        fares: null,
        fare: null,

        message: "",
        message_blink: 0,
        message_last: "",

        selectMessage: "Select fare [1-4]",
        initFares: true,

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

            if (this.frame % (this.initFares ? 100 : data.framesPerHour) == 0) {
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
                if (Ω.input.pressed("moused")) {
                    //console.log(Ω.input.mouse)
                    var x = Ω.input.mouse.x,
                        y = Ω.input.mouse.y,
                        minx = 20,
                        miny = 70,
                        maxx = 200,
                        maxy = 220;
                    if (x > minx && x < maxx && y > miny && y < maxy) {
                        var eachButtonHeight = (maxy - miny) / 4;
                        pressedIdx = (y - miny) / eachButtonHeight | 0;
                    }
                }

                if (pressedIdx > -1) {
                    if (this.fare && this.fare.pickedUp) {
                        this.setMessage("Fare in progress!", undefined, true);
                    } else if (this.fares[pressedIdx]) {
                        var fare = this.fares[pressedIdx];
                        if (fare === this.fare) {
                            fare.selected = false
                            this.fare = null;
                            this.setMessage(this.selectMessage);
                        } else {
                            fare.selected = true;
                            if (this.fare) {
                                this.fare.selected = false;
                            }
                            this.fare = fare;
                            this.setMessage("Pickup from: " + this.fare.src.name);
                        }
                    }
                }
            }

            this.level.tick();
        },

        getStep: function () {
            var fare = this.fare;
            if (!fare) {
                return this.selectMessage;
            }
            if (fare.pickedUp) {
                return "Drop off at " + fare.dest.name;
            }
            return "Pickup at " + fare.src.name;

        },

        onRightPlanet: function (planet) {

            var fare = this.fare;
            if (!fare) return false;

            return (fare.src === planet && !fare.pickedUp) || (fare.dest === planet && fare.pickedUp)

        },

        setMessage: function (message, blinkTime, revertAfterBlink) {
            this.message_last = revertAfterBlink ? this.message : "";
            this.message = message;
            this.message_blink = blinkTime || 200;

        },

        doneFare: function () {
            var fare = this.fare;
            if (fare) {
                fare.selected = false;
            }
            this.fare = null;
            this.fares = this.fares.filter(function (f) {
                return f !== fare;
            });
        },

        pickedUpFare: function (fare) {
           fare.pickedUp = true;
           this.setMessage("Drop off at:" + fare.dest.name);
        },

        addHour: function () {

            var doIt = Math.random() < 0.3;

            if (this.hour++ % 2 == 0) {
                (this.initFares || doIt) && this.addFare();
            } else {
                (!this.initFares && doIt) && this.removeFare();
            }

        },

        addFare: function () {

            if (this.fares.length >= this.maxFares) {
                return;
            }

            var planets = this.levels.asteroids.planets;

            // Need to... asses "par" time
            // - time to get to planet
            // - time to get to dest
            // - time to get to pad
            // dangerousness
            // - difficulty of src pad
            // - difficulty of dest pad

            var src = planets[Ω.utils.rand(planets.length - 2)],
                dst = planets[Ω.utils.rand(planets.length - 2)],
                src_pad = Ω.utils.rand(src.surface.pads),
                dst_pad = Ω.utils.rand(dst.surface.pads),
                diff_src = src.surface.hard[src_pad],
                diff_dest = dst.surface.hard[dst_pad],
                tot_diff = ((diff_src + diff_dest) / 20) * 5;


            this.fares.push({
                src: src,
                src_pad: src_pad,
                dest: dst,
                dest_pad: dst_pad,
                bid: Ω.utils.rand(1000, 4000),
                tips: Ω.utils.rand(3000),
                pickedUp: false,
                difficulty: tot_diff
            });

            if (this.initFares && this.fares.length === this.maxFares) {
                this.initFares = false;
            }
        },

        removeFare: function () {
            var fare = this.fares[Ω.utils.rand(this.fares.length)];
            if (fare === this.fare) {
                return;
            }
            this.fares = this.fares.filter(function (f) {
                return f !== fare;
            });

        },

        goto: function (level, planet) {
            switch(level) {
            case "land":
                data.physics = data.physics_planet;
                this.level = new Levels.LunarLander(planet, this);
                if (!this.onRightPlanet(planet)) {
                    this.setMessage("No business here.");
                    break;
                } else {
                    var fare = this.fare,
                        pickedUp = fare.pickedUp,
                        pad = pickedUp ? fare.dest_pad : fare.src_pad;

                    this.setMessage((pickedUp ? "Drop off on" : "Pick up from") + " Pad " + (pad + 1));
                }
                break;
            case "fly":
                data.physics = data.physics_space;
                this.level = this.levels.asteroids;
                this.level.depart(planet);
                this.setMessage(this.getStep());
                break;
            case "depot":
                this.level = new Levels.Depot(planet, this)
                this.setMessage("Stop wasting time at the depot.");
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
