define([
  'app',
  'services/CanvasService'
], function(app) {
  'use strict';

  console.log("ready to create CanvasHolderCtrl");
  app.controller('CanvasHolderCtrl', [
    '$scope',
    'CanvasService',
    function($scope, CanvasService) {
      console.log("CanvasHolderCtrl calling into CanvasService");
      var slides = $scope.slides = [];
      var currIndex = 0;

      $scope.addCanvas = function(clickedItem) {
        var newCanvasDiv = CanvasService.makeCanvasDiv(currIndex);
        $scope.addSlide(newCanvasDiv, currIndex);
        CanvasService.loadCanvas(slides[slides.length - 1], currIndex++);
        // $scope.safeApply();
      };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof fn === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      $scope.addSlide = function(div, currIndex) {
        var newWidth = 600 + slides.length + 1;
        slides.push({
          div : div,
          id: currIndex
        });
      };
    }
  ]);
});
