(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        level: null,

        hour: 0,

        maxFares: 4,
        availableFares: null,
        currentFare: null,

        message: "",
        message_blink: 0,
        message_last: "",

        selectMessage: "Select a fare [1-4]",
        initFares: true,

        init: function () {

            this.availableFares = [];
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
                
                /*if (pressedIdx > -1) {
                    if (this.currentFare && this.currentFare.pickedUp) {
                        this.setMessage("Fare in progress!", undefined, true);
                    } else if (this.availableFares[pressedIdx]) {
                        var fare = this.availableFares[pressedIdx];
                        if (fare === this.currentFare) {
                            fare.selected = false
                            this.currentFare = null;
                            this.setMessage(this.selectMessage);
                        } else {
                            fare.selected = true;
                            if (this.currentFare) {
                                this.currentFare.selected = false;
                            }
                            this.currentFare = fare;
                            this.setMessage("Pickup from: " + this.currentFare.src.name);
                        }
                    }
                }
                */
            }

            this.level.tick();
        },

        getStep: function () {
            var fare = this.currentFare;
            if (!fare) {
                return this.selectMessage;
            }
            if (fare.pickedUp) {
                return "Drop off at " + fare.dest.name;
            }
            return "Pickup at " + fare.src.name;

        },

        onRightPlanet: function (planet) {

            var fare = this.currentFare;
            if (!fare) return false;

            return (fare.src === planet && !fare.pickedUp) || (fare.dest === planet && fare.pickedUp)

        },

        setMessage: function (message, blinkTime, revertAfterBlink) {
            if (message === this.selectMessage) {
                blinkTime = 10000;
            }
            this.message_last = revertAfterBlink ? this.message : "";
            this.message = message;
            this.message_blink = blinkTime || 200;

        },

        doneFare: function () {
            var fare = this.currentFare;
            if (fare) {
                fare.selected = false;
            }
            this.currentFare = null;
            this.availableFares = this.availableFares.filter(function (f) {
                return f !== fare;
            });
        },

        pickedUpFare: function (fare) {
           fare.pickedUp = true;
           this.setMessage("Drop off at: " + fare.dest.name);
        },

        addHour: function () {

            if (this.hour++ % 2 == 0) {
                (this.initFares || Math.random() < 0.6) && this.addFare();
            } else {
                (!this.initFares && Math.random() < 0.4) && this.removeFare();
            }

        },

        addFare: function () {

            if (this.availableFares.length >= this.maxFares) {
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

            var ok = false;
            while(!ok) {
                var src = planets[Ω.utils.rand(planets.length - 2)],
                    dst = planets[Ω.utils.rand(planets.length - 2)],
                    src_pad = Ω.utils.rand(src.surface.pads.length),
                    dst_pad = Ω.utils.rand(dst.surface.pads.length),
                    diff_src = src.surface.pads[src_pad],
                    diff_dest = dst.surface.pads[dst_pad],
                    tot_diff = ((diff_src + diff_dest) / 20);

                if (src !== dst) {
                    ok = true;
                }
            }

            var fare = {
                src: src,
                src_pad: src_pad,
                dest: dst,
                dest_pad: dst_pad,
                bid: Ω.utils.rand(1000, 4000),
                tips: Ω.utils.rand(3000),
                pickedUp: false,
                difficulty: tot_diff
            };
            fare.e = new Fare(fare, this);

            this.availableFares.push(fare);

            if (this.initFares && this.availableFares.length === this.maxFares) {
                this.initFares = false;
            }
        },

        removeFare: function () {
            var fare = this.availableFares[Ω.utils.rand(this.availableFares.length)];
            if (fare === this.currentFare) {
                return;
            }
            this.availableFares = this.availableFares.filter(function (f) {
                return f !== fare;
            });

        },

        getRanking: function () {

            var pos = 1000001 - Math.min(1000000, Math.floor(this.player.guber_cred * 40.5));

            if (pos === 1) {
                game.win();
            }

            return [pos, this.player.guber_cred == 0 ? 
                "unranked" : 
                pos + (pos === 3 ? "rd" : pos === 2 ? "nd" : pos === 1 ? "st" : "th")];

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
                    var fare = this.currentFare,
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

            this.clear(gfx, "hsl(195, 40%, 5%)");
            c.font = "16pt monospace";

            this.level.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
