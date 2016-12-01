/*global console, define, document */

(function () {
    "use strict";
    console.log("MultiCanvas setup");

    define([],
        function () {
            console.log("entering MultiCanvas");
            /*
             * Canvas object
             */
            var Canvas = function (el, ndx) {
                this.el = el;
                this.ndx = ndx;
            };
            Canvas.prototype.init = function () {
                var mapParent = document.getElementsByClassName('MapContainer')[0];

                this.el.style.backgroundColor = "#888";
                // this.el.addEventListener("mousedown", this.onMouseDown.bind(this));
                // this.el.addEventListener("mousemove", this.onMouseMove.bind(this));

                mapParent.appendChild(this.el);
            };
            Canvas.prototype.onMouseDown = function () {
                console.log('onMouseDown: ', this.el);
                // event.cancelBubble=true;
                // event.stopPropagation();
            };
            Canvas.prototype.onMouseMove = function (event) {
                //console.log('onMouseMove: ', this.el);
                event.preventDefault();
                // event.cancelBubble=true;
                // event.stopPropagation();
            };

            return {
                Canvas: Canvas
            };
        });

}());
