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
                var mapParent = document.getElementsByClassName('MapContainer')[0]; //' + this.ndx);

                // this.el.innerHTML = "Map " + this.ndx;
                this.el.style.backgroundColor = "#888";
                this.el.addEventListener("mousedown", this.onMouseDown.bind(this));

                mapParent.appendChild(this.el);
            };
            Canvas.prototype.onMouseDown = function (event) {
                console.log('onMouseDown: ', this.el);
                // event.cancelBubble=true;
                // event.stopPropagation();
            };
            // function addCanvas () {
            //    var doc = document.getElementById('canvasholder'),
            //       newCanvas = document.createElement('div'),
            //       newChild;
            //    newCanvas.id = "three";
            //    newCanvas.innerHTML = 'three';
            //    doc.appendChild(newCanvas);
            //    newChild = document.getElementById('three');
            //    console.debug(newChild);
            //    canvases.push(new Canvas(newChild));
            //    canvases[canvases.length-1].init();
            // }

            // window.onload = function () {
            //     console.log("window.onload");
            //     document.getElementById("addcanbtn").onclick = function() {addCanvas()};
            //
            //     canvases[0] = new Canvas(document.getElementById('one'));
            //     canvases[1] = new Canvas(document.getElementById('two'));
            //     canvases[0].init();
            //     canvases[1].init();
            // }
            return {Canvas : Canvas};
        });

}).call(this);
