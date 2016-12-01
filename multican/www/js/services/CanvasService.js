/*global require, define, console, document*/

require(['libs/MultiCanvas']);

define([
    'app',
    'libs/MultiCanvas'
], function(app, MultiCanvas) {
    'use strict';

    app.service('CanvasService', [
    function() {
        var canvases = [];

        console.log("CanvasService to return canvas");

        this.makeCanvasSlideListItem = function(ndx) {
            var newCanvasItem = document.createElement('li');
            newCanvasItem.id = "slide" + ndx;
            return newCanvasItem;
        };
        this.loadCanvasSlideListItem = function(elem, ndx) {
            canvases.push(new MultiCanvas.Canvas(elem, ndx));
            canvases[canvases.length - 1].init();
        };

        this.getCanvasSlideListItem = function(ndx) {
            return canvases[ndx];
        };

    }
    ]);
});
