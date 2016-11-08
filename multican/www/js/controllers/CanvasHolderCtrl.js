/*global define, console */

define([
    'app',
    'services/CanvasService',
    'services/SimpleSlides'
], function(app) {
    'use strict';

    console.log("ready to create CanvasHolderCtrl");
    app.controller('CanvasHolderCtrl', [
        '$scope',
        'CanvasService',
        'SimpleSlidesService',
        function($scope, CanvasService, SimpleSlidesService) {
            console.log("CanvasHolderCtrl calling into CanvasService");
            var slides = $scope.slides = [],
                currIndex = 0;

            $scope.addCanvas = function(clickedItem) {
                $scope.addSlide(null, currIndex);
                $scope.slides[$scope.slides.length - 1].id = 0;

                $scope.safeApply();
                var newCanvasItem = CanvasService.makeCanvasItem(currIndex);
                CanvasService.loadCanvas(newCanvasItem, currIndex);
                SimpleSlidesService.addSlide(newCanvasItem);
                currIndex++;
            };

            $scope.safeApply = function(fn) {
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

            $scope.addSlide = function(itm, currIndex) {
                // var newWidth = 600 + slides.length + 1;
                slides.push({
                    item: itm,
                    id: currIndex
                });
            };
        }
    ]);
});
