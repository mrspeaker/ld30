(function () {

    "use strict";

    var BadGuy = Ω.Entity.extend({
        w: 32,
        h: 32,
        size: 32,

        init: function (x, y, player) {
            this._super(x, y);
            this.player = player;
        },

        tick: function () {
            var sp = 4,
                x = 0,
                y = 0;
            if (this.x < this.player.x) { x = sp; }
            if (this.x > this.player.x) { x = -sp; }
            if (this.y < this.player.y) { y = sp; }
            if (this.y > this.player.y) { y = -sp; }

            if (x !== 0 && y !== 0) {
                x *= 0.75;
                y *= 0.75;
            }
            this.x += x;
            this.y += y;


            if (Ω.math.dist(this, this.player) < this.size) {
                this.player.hit(this);
            }
            return !(this.remove);
        }
    });

    window.BadGuy = BadGuy;
    
}());
