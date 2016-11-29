/*global define, console, document, angular, setTimeout, require*/
// require(['services/MapInstanceService']);

(function () {
    "use strict";

    console.log('CanvasHolderCtrl setup');
    require(['libs/MLConfig']);
    define([
        'app',
        'libs/MLConfig',
        'services/CanvasService',
        'services/MapInstanceService',
        'controllers/MapCtrl',
        'controllers/CarouselCtrl'
    ], function (app, MLConfig) {

        console.log("ready to create CanvasHolderCtrl");
        app.controller('CanvasHolderCtrl', [
            '$scope',
            'CanvasService',
            'MapInstanceService',
            // 'libs/MLConfig',
            function ($scope, CanvasService, MapInstanceService) {
                console.log("CanvasHolderCtrl calling into CanvasService");
                // var currIndex = MapInstanceService.getSlideCount();
                $scope.addCanvas = function () {
                    var currIndex = MapInstanceService.getSlideCount(),
                        // mlConfig = new MLConfig.MLConfig(currIndex),
                        newCanvasItem,
                        mapDctv,
                        parentDiv;
                    // currIndex = MapInstanceService.getSlideCount();
                    //mlConfig.setMapId(currIndex);
                    // MapInstanceService.addConfigInstanceForMap(currIndex, mlConfig);

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
                            var currIndex = MapInstanceService.getSlideCount(),
                                mlConfig = new MLConfig.MLConfig(currIndex);
                            MapInstanceService.addConfigInstanceForMap(currIndex, angular.copy(mlConfig));
                            console.log('CanvasHolderCtrl ready to startMap with currIndex ' + currIndex);
                            scope.startMap(currIndex);
                            //mlConfig.setMapHosterInstance(MapInstanceService.getMapHosterInstance(currIndex));
                            testMapNumbers();
                            MapInstanceService.incrementMapNumber();
                        }, 10);
                    });

                    $scope.$broadcast('addslide', {
                        newMapLi: newCanvasItem,
                        slideNumber: currIndex
                    });
                    function testMapNumbers() {
                        var i,
                            currentMapInstance;
                        for(i= 0; i < MapInstanceService.getSlideCount(); i++) {
                            console.log("testMapNumbers for " + i);
                            currentMapInstance = MapInstanceService.getMapHosterInstance(i);
                            console.log("map number is " + currentMapInstance.getMapNumber());
                        }
                    }
                    $scope.centerOnMe = function () {
                        console.log("centerOnMe");
                        testMapNumbers();
                        var currentMapNumber = MapInstanceService.getCurrentSlide(),
                            // currentMapInstance = MapInstanceService.getConfigInstanceForMap(currentMapNumber).getMapHosterInstance();
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
