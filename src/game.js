(function (Ω) {

    "use strict";

    var ConWorldsCabGame = Ω.Game.extend({

        canvas: "#board",

        init: function (w, h) {

            this._super(w, h);

            Ω.evt.progress.push(function (remaining, max) {
                console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "space": "space",
                "touch": "touch",
                "escape": "escape",
                "left": "left",
                "right": "right",
                "up": "up",
                "down": "down",
                "moused": "mouse1"
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
