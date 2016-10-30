define([
  'app'
], function(app) {
  'use strict';

  console.log("ready to create canvas service");
  app.service('CanvasService', [
    function() {
      var canvases = [];
      canvases[0] = new Canvas(document.getElementById('one'));
      canvases[1] = new Canvas(document.getElementById('two'));

      console.log("CanvasService to return canvas");

      this.addCanvas = function() {
        var doc = document.getElementById('canvasholder'),
          newCanvas = document.createElement('div'),
          newChild;
        newCanvas.id = "three";
        newCanvas.innerHTML = 'three';
        doc.appendChild(newCanvas);
        newChild = document.getElementById('three');
        console.debug(newChild);
        canvases.push(new Canvas(newChild));
        canvases[canvases.length - 1].init();
      };
    }
  ]);
});
