/*global define, console */
// require(['services/MapInstanceService']);

(function () {
    "use strict";

    console.log('CanvasHolderCtrl setup');
    define([
        'app',
        'services/CanvasService',
        'services/MapInstanceService',
        'controllers/CarouselCtrl',
        'controllers/MapCtrl',
    ], function(app, CanvasService, MapInstanceService) {

        console.log("ready to create CanvasHolderCtrl");
        app.controller('CanvasHolderCtrl', [
            '$scope',
            'CanvasService',
            'MapInstanceService',
            function($scope, CanvasService, MapInstanceService) {
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
                      scope.startMap(currIndex);
                    });

                    $scope.safeApply(function () {console.log("safeApply callback")});
                    $scope.$broadcast('addslide', {newMapLi : newCanvasItem});
                    MapInstanceService.incrementMapNumber();
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
}());
