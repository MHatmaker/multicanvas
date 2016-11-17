/*global console, define, document */

(function () {
    "use strict";

    define ([],
        function () {
            console.log("entering MultiCanvas");
            /*
             * Canvas object
             */
            var Canvas = function (el, ndx) {
                this.el = el;
                this.ndx = ndx;
            },
            canvases = [];
            Canvas.prototype.init = function () {
                var mapParent = document.getElementsByClassName('MapContainer')[0];

                this.el.style.backgroundColor = "#888";
                // this.el.addEventListener("mousedown", this.onMouseDown.bind(this));

                mapParent.appendChild(this.el);
            };
            Canvas.prototype.onMouseDown = function (event) {
                console.log('onMouseDown: ', this.el);
                // event.cancelBubble=true;
                // event.stopPropagation();
            };

            return {Canvas : Canvas};
        });

}).call(this);
