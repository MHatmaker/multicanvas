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
      $scope.addCanvas = function(clickedItem) {
        CanvasService.addCanvas();
      }
    }
  ]);
});
