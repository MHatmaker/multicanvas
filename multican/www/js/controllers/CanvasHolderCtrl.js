/*global define, console */
// require(['services/MapInstanceService']);

define([
    'app',
    'services/CanvasService',
    'services/SimpleSlides',
    'services/MapInstanceService',
    'controllers/MapDirective',
    'controllers/MapCtrl'
], function(app) {
    'use strict';

    console.log("ready to create CanvasHolderCtrl");
    app.controller('CanvasHolderCtrl', [
        '$scope',
        'CanvasService',
        'SimpleSlidesService',
        'MapInstanceService',
        'controllers/MapDirective',
        function($scope, CanvasService, SimpleSlidesService, MapInstanceService, MapDirective) {
            console.log("CanvasHolderCtrl calling into CanvasService");
            var slides = $scope.slides = [],
                currIndex = MapInstanceService.getMapNumber();

            $scope.addCanvas = function(clickedItem) {
                currIndex = MapInstanceService.getMapNumber();
                $scope.addSlide(null, currIndex);
                $scope.slides[$scope.slides.length - 1].id = 0;

                $scope.safeApply();
                var newCanvasItem = CanvasService.makeCanvasItem(currIndex);
                CanvasService.loadCanvas(newCanvasItem, currIndex);

                var mapDctv = document.createElement('mapdirective'),
                  parentDiv = newCanvasItem; //document.getElementById('MapContainer');
                parentDiv.appendChild(mapDctv);
                angular.element(mapDctv).injector().invoke(function($compile) {
                  var scope = angular.element(mapDctv).scope();
                  $compile(mapDctv)(scope);
                  console.log("compiled mapDctv");
                  console.debug(scope);
                  scope.startMap();
                });

                $scope.safeApply(function () {console.log("safeApply callback")});
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
