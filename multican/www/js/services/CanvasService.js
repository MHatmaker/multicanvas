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

        console.log("CanvasService to return canvas");

        this.makeCanvasItem = function(ndx) {
            var newCanvasItem = document.createElement('li');
            newCanvasItem.id = "slide" + ndx;
            return newCanvasItem;
        };
        this.loadCanvas = function(elem, ndx) {
            canvases.push(new MultiCanvas.Canvas(elem, ndx));
            canvases[canvases.length - 1].init();
        };

        this.getCanvas = function(ndx) {
            return canvases[ndx];
        };

    }
    ]);
});
