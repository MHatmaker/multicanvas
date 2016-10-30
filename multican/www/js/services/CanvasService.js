require(['services/MultiCanvas'
]);

define([
  'app',
  'services/MultiCanvas',
], function(app, MultiCanvas) {
  'use strict';

  console.log("ready to create canvas service");
  app.service('CanvasService', [
    function() {
      var canvases = [];
      canvases[0] = new MultiCanvas.Canvas(document.getElementById('one'));
      canvases[0].init();
      canvases[1] = new MultiCanvas.Canvas(document.getElementById('two'));
      canvases[1].init();

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
        canvases.push(new MultiCanvas.Canvas(newChild));
        canvases[canvases.length - 1].init();
      };
    }
  ]);
});
