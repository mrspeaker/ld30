(function () {

    "use strict";

    var Bullet = Ω.Entity.extend({
        w: 10,
        h: 10,
        size: 10,

        life: 30,

        init: function (x, y, angle) {
            this._super(x, y);
            //angle -= Math.PI / 2;

            var speed = 14;
            this.xspeed = speed * Math.cos(angle);
            this.yspeed = speed * Math.sin(angle);
        },

        tick: function () {
            this.x += this.xspeed;
            this.y += this.yspeed;

            return this.life-- >= 0;
        }
    });

    window.Bullet = Bullet;
    
}());
