(function (Ω) {

    "use strict";

    var ConWorldsCabGame = Ω.Game.extend({

        canvas: "#board",
        fps: true,

        init: function (w, h) {

            this._super(w, h);

            Ω.evt.progress.push(function (remaining, max) {
                //console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "space": "space",
                "touch": "touch",
                "escape": "escape",
                "left": ["a", "left"],
                "right": ["d", "right"],
                "up": ["w", "up"],
                "down": ["s", "down"],
                "moused": "mouse1",
                "one": 49,
                "two": 50,
                "three": 51,
                "four": 52
            });

        },

        stopPreload: function () {
            // Clear the preloader thing
            if (preloo) {
                clearInterval(preloo);
                document.querySelector("#board").style.background = "#000";
            }

        },

        win: function () {
            this.setScreen(new WinScreen());
        },

        reset: function () {

            this.setScreen(new IntroScreen());

        },

        load: function () {

            this.stopPreload();

            this.reset();

        }

    });

    window.ConWorldsCabGame = ConWorldsCabGame;

}(Ω));
