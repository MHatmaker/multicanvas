/*global require, define, console, document*/

require(['services/MultiCanvas']);

define([
    'app',
    'services/MultiCanvas'
], function(app, MultiCanvas) {
    'use strict';

    app.service('CanvasService', [
    function() {
        var canvases = [];
        // canvases[0] = new MultiCanvas.Canvas(document.getElementById('one'));
        // canvases[0].init();
        // canvases[1] = new MultiCanvas.Canvas(document.getElementById('two'));
        // canvases[1].init();

        console.log("CanvasService to return canvas");

        this.makeCanvasItem = function(ndx) {
            var newCanvasItem = document.createElement('li');
            newCanvasItem.id = "slide" + ndx;
            return newCanvasItem;
        };
        this.loadCanvas = function(elem, ndx) {
            // google, leaflet, arcgis create map
            //    var doc = document.getElementById('div');
            // div.innerhtml = "here is slide" + ndx;
            canvases.push(new MultiCanvas.Canvas(elem, ndx));
            canvases[canvases.length - 1].init();
            var mapDiv = document.createElement('div');
            mapDiv.id = 'map' + ndx;
            elem.appendChild(mapDiv);
            // doc.appendChild(div);
        };

        this.addCanvas = function() {
            var doc = document.getElementById('canvasholder'),
                newCanvas = document.createElement('div'),
                newChild;
            newCanvas.id = "three";
            newCanvas.innerHTML = 'three';
            doc.appendChild(newCanvas);
            newChild = document.getElementById('three');
            console.debug(newChild);
            canvases.push(new MultiCanvas.Canvas(newChild));
            canvases[canvases.length - 1].init();
            return newCanvas;
        };
        this.getCanvas = function(ndx) {
            return canvases[ndx];
        };

    }
    ]);
});
