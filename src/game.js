(function (Ω) {

    "use strict";

    var ConWorldsCabGame = Ω.Game.extend({

        canvas: "#board",
        fps: false,

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

        reset: function () {

            this.setScreen(new IntroScreen());

        },

        load: function () {

            this.reset();

        }

    });

    window.ConWorldsCabGame = ConWorldsCabGame;

}(Ω));
