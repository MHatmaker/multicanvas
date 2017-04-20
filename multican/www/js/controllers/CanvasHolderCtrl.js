/*global define, console, document, angular, setTimeout, require*/
// require(['services/MapInstanceService']);

(function () {
    "use strict";

    console.log('CanvasHolderCtrl setup');
    // require(['libs/MLConfig']);
    define([
        'app',
        'libs/MLConfig',
        'controllers/MapCtrl',
        'services/CanvasService',
        'services/MapInstanceService'
        // 'controllers/CarouselCtrl'
    ], function (app, MLConfig, MapCtrl) {

        console.log("ready to create CanvasHolderCtrl");
        app.controller('CanvasHolderCtrl', [
            '$scope',
            'CanvasService',
            'MapInstanceService',
            // 'libs/MLConfig',
            function ($scope, CanvasService, MapInstanceService) {
                console.log("CanvasHolderCtrl calling into CanvasService");
                $scope.addCanvas = function (mapType) {
                    console.log("in CanvasHolderCtrl.addCanvas");
                    var currIndex = MapInstanceService.getSlideCount(),
                        // mlConfig = new MLConfig.MLConfig(currIndex),
                        newCanvasItem,
                        mapDctv,
                        parentDiv;

                    newCanvasItem = CanvasService.makeCanvasSlideListItem(currIndex);
                    mapDctv = document.createElement('mapdirective');
                    parentDiv = newCanvasItem;
                    CanvasService.loadCanvasSlideListItem(newCanvasItem, currIndex);

                    parentDiv.appendChild(mapDctv);
                    angular.element(mapDctv).injector().invoke(function ($compile) {
                        var scope = angular.element(mapDctv).scope();
                        $compile(mapDctv)(scope);
                        console.log("compiled mapDctv with map id " + currIndex);
                        console.debug(scope);
                        setTimeout(function () {
                            currIndex = MapInstanceService.getSlideCount();
                            var
                                mlConfig = new MLConfig.MLConfig(currIndex);
                            MapInstanceService.addConfigInstanceForMap(currIndex, angular.copy(mlConfig));
                            console.log('CanvasHolderCtrl ready to startMap with currIndex ' + currIndex);
                            scope.startMap(currIndex, mapType);
                            MapInstanceService.incrementMapNumber();
                        }, 10);
                    });

                    $scope.$broadcast('addslide', {
                        mapListItem: newCanvasItem,
                        slideNumber: currIndex,
                        mapName: "Map " + currIndex
                    });
                    $scope.centerOnMe = function () {
                        console.log("centerOnMe");
                        var currentMapNumber = MapInstanceService.getCurrentSlide(),
                            currentMapInstance = MapInstanceService.getMapHosterInstance(currentMapNumber);
                        console.log("getCurrentSlide() returned " + currentMapNumber);
                        console.log("CanvasHolderCtrl.centerOnMe for map " + currentMapInstance.getMapNumber());
                        currentMapInstance.centerOnMe();
                    };
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
