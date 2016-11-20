/*global define, console, document, angular, setTimeout*/
// require(['services/MapInstanceService']);

(function () {
    "use strict";

    console.log('CanvasHolderCtrl setup');
    define([
        'app',
        'services/CanvasService',
        'services/MapInstanceService',
        'controllers/MapCtrl',
        'controllers/CarouselCtrl'
    ], function (app) {

        console.log("ready to create CanvasHolderCtrl");
        app.controller('CanvasHolderCtrl', [
            '$scope',
            'CanvasService',
            'MapInstanceService',
            function ($scope, CanvasService, MapInstanceService) {
                console.log("CanvasHolderCtrl calling into CanvasService");
                var currIndex = MapInstanceService.getMapNumber();

                $scope.addCanvas = function () {
                    currIndex = MapInstanceService.getMapNumber();

                    var newCanvasItem = CanvasService.makeCanvasSlideListItem(currIndex),
                        mapDctv = document.createElement('mapdirective'),
                        parentDiv = newCanvasItem;
                    CanvasService.loadCanvasSlideListItem(newCanvasItem, currIndex);

                    parentDiv.appendChild(mapDctv);
                    angular.element(mapDctv).injector().invoke(function ($compile) {
                        var scope = angular.element(mapDctv).scope();
                        $compile(mapDctv)(scope);
                        console.log("compiled mapDctv with map id " + currIndex);
                        console.debug(scope);
                        setTimeout(function () {
                            scope.startMap(currIndex);
                            MapInstanceService.incrementMapNumber();
                        });
                    });

                    $scope.$broadcast('addslide', {
                        newMapLi: newCanvasItem
                    });
                };

                $scope.removeCanvas = function (clickedItem) {
                    console.log("removeCanvas");
                    console.debug(clickedItem);
                    $scope.$broadcast('removeslide');
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
            }
        ]);
    });
}());
