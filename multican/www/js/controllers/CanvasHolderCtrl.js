define([
  'app',
  'services/CanvasService'
], function (app) {
  'use strict';

  console.log("ready to create CanvasHolderCtrl");
  app.controller('CanvasHolderCtrl', [
    '$scope',
    'services/CanvasService',
    function ($scope, CanvasService) {
      console.log("CanvasHolderCtrl calling into CanvasService");
      $scope.name = CanvasService.addCanvas();
        $scope.addCanvas = function (clickedItem) {
            CanvasService.addCanvas();
        }
    }
  ]);
});
