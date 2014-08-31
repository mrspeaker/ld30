(function (Ω) {

    "use strict";

    var SVGLevel = Ω.Class.extend({

        layers: null,

        // TODO calc bb?
        w: 1000,
        h: 1000,

        init: function (file, containerId, onload) {

            var self = this;

            this.layers = [];
            this.containerId = containerId;
            this.onload = onload;

            if (typeof file !== "string") {
                self.processLevel(file);
                return;
            }

            // TODO: make sure not cached!
            Ω.utils.ajax(file, function (xhr) {

                self.raw = xhr.responseXML;

                // TODO: handle xhr errors
                if (containerId) {
                    self.processLevel(self.raw);
                }

            });
        },

        layer: function (name) {

            var layer = Ω.utils.getByKeyValue(this.layers, "id", name);
            if (!layer) {
                console.log("Tiled layer '" + name + "' not found.");
                return {};
            }

            return layer;
        },

        processLevel: function (xml) {

            this.w  = parseInt(xml.firstChild.getAttribute("width"), 10);
            this.h  = parseInt(xml.firstChild.getAttribute("height"), 10);

            var toArray = function (arrayLike) {
                return Array.prototype.slice.call(arrayLike, 0);
            };

            this.raw = xml;

            var body = xml.querySelector(this.containerId);
            if (!body) {
                console.error("couldn't find container: ", this.container, xml);
                return;
            }

            this.layers = toArray(xml.querySelectorAll(this.containerId + " > g")).map(function (layer) {
                var out = {
                    x: 0,
                    y: 0
                };

                if (layer.id) out.id = layer.id;
                if (layer.stroke) out.stroke = layer.stroke;
                if (layer.getAttribute("transform")) {
                    var trans = layer.getAttribute("transform").split("(")[1].split(")")[0].split(",").map(function (xy) {
                       return parseFloat(xy, 10);
                    });
                    out.x = trans[0];
                    out.y = trans[1];
                }
                out.data = [];
                var children = toArray(layer.childNodes).filter(function (c) {
                    if (c.nodeType === 3) return false; // Text node

                    var o = {};

                    switch (c.nodeName) {
                    case "path":
                        o.type = "polygon";
                        o.path = c.getAttribute("d").split(" ").filter(function (e, i) {
                                if (e === "Z") return false;
                                return true;
                            }).map(function (e, i) {
                                var vals = e.slice(1).split(",").map(function (v) { return parseFloat(v, 10); });
                                return { x: vals[0] + out.x, y: vals[1] + out.y };
                            });
                        break;
                    case "rect":
                        o.type = "rectangle";
                        o.w = parseInt(c.getAttribute("width"), 10);
                        o.h = parseInt(c.getAttribute("height"), 10);
                        o.x = parseInt(c.getAttribute("x"), 10) + out.x;
                        o.y = parseInt(c.getAttribute("y"), 10) + out.y;
                        break;
                    }

                    out.data.push(o);
                    return true;
                });
                

                return out;
            });

            if (this.onload) {
                this.onload(this);
            }
        }

    });

    Ω.SVGLevel = SVGLevel;

}(Ω));
