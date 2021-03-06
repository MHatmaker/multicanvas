/*global define, console, document, angular, setTimeout, require*/
// require(['services/MapInstanceService']);

(function () {
    "use strict";

    console.log('CanvasHolderCtrl setup');
    // require(['libs/MLConfig']);
    define([
        'libs/MLConfig',
        'controllers/CarouselCtrl'
    ], function (MLConfig, CarouselCtrl) {

        console.log('CanvasHolderCtrl define');
        var selfMethods = {},
            isInstantiated = false;

        function CanvasHolderCtrl($scope, $rootScope, $uibModal, LinkrService, MapInstanceService, CanvasService, $window) {
            console.log("ready to create CanvasHolderCtrl");
            $scope.addCanvas = function (mapType, mlcfg, resolve) {
                console.log("in CanvasHolderCtrl.addCanvas");
                var currIndex = MapInstanceService.getSlideCount(),
                    // mlConfig = new MLConfig.MLConfig(currIndex),
                    newCanvasItem,
                    mapDctv,
                    parentDiv,
                    mlConfig;
                if (mlcfg) {
                    mlConfig = mlcfg;
                } else {
                    if (MapInstanceService.hasConfigInstanceForMap(currIndex) === false) {
                        mlConfig = new MLConfig.MLConfig(currIndex);
                        console.log("addCanvas with index " + currIndex);
                        mlConfig.setPosition(MapInstanceService.getConfigInstanceForMap(currIndex === 0 ? currIndex : currIndex - 1).getPosition());
                        MapInstanceService.setConfigInstanceForMap(currIndex, mlConfig); //angular.copy(mlConfig));
                    }
                }
                newCanvasItem = CanvasService.makeCanvasSlideListItem(currIndex);
                mapDctv = document.createElement('mapdirective');
                parentDiv = newCanvasItem;
                CanvasService.loadCanvasSlideListItem(newCanvasItem, currIndex);

                parentDiv.appendChild(mapDctv);
                angular.element(mapDctv).injector().invoke(function ($compile) {
                    var scope = angular.element(mapDctv).scope();
                    $compile(mapDctv)(scope);
                    console.log("CanvasHolderCtrl compiled mapDctv with map id " + currIndex);
                    console.debug(scope);
                    setTimeout(function () {
                        // currIndex = MapInstanceService.getSlideCount();
                        // var
                        //     mlConfig = new MLConfig.MLConfig(currIndex);
                        // MapInstanceService.setConfigInstanceForMap(currIndex, angular.copy(mlConfig));
                        console.log('CanvasHolderCtrl ready to startMap with currIndex ' + currIndex);
                        scope.startMap(currIndex, mapType);
                        MapInstanceService.incrementMapNumber();
                        if (resolve) {
                            resolve();
                        }
                    }, 10);
                });

                $scope.$on('selectMapTypeEvent', function (evt, data) {
                    console.log('CanvasHolderCtrl on selectMapTypeEvent');
                    console.debug(data);
                    $scope.addCanvas(data.mapType);
                });
                $scope.$broadcast('addslide', {
                    mapListItem: newCanvasItem,
                    slideNumber: currIndex,
                    mapName: "Map " + currIndex
                });
                angular.element($window).bind('resize', function () {
                    $scope.$broadcast('CanvasHolderResizeEvt');
                });
                $scope.centerOnMe = function () {
                    console.log("centerOnMe");
                    var currentMapNumber = MapInstanceService.getCurrentSlide(),
                        currentMapInstance = MapInstanceService.getMapHosterInstance(currentMapNumber);
                    console.log("getCurrentSlide() returned " + currentMapNumber);
                    console.log("CanvasHolderCtrl.centerOnMe for map " + currentMapNumber);
                    currentMapInstance.centerOnMe();
                };
                selfMethods.centerOnMe = $scope.centerOnMe;
            };
            selfMethods.addCanvas = $scope.addCanvas;

            $scope.removeCanvas = function (clickedItem) {
                console.log("removeCanvas");
                console.debug(clickedItem);
                MapInstanceService.removeInstance(CarouselCtrl.getCurrentSlideNumber());
                $scope.$broadcast('removeslide');
            };
            selfMethods.removeCanvas = $scope.removeCanvas;

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
        function addCanvas(maptype, mlcfg, resolve) {
            selfMethods.addCanvas(maptype, mlcfg, resolve);
        }
        CanvasHolderCtrl.prototype.addCanvas = function (maptype, mlcfg, resolve) {
            selfMethods.addCanvas(maptype, mlcfg, resolve);
        };
        CanvasHolderCtrl.prototype.removeCanvas = function () {
            selfMethods.removeCanvas();
        };
        CanvasHolderCtrl.prototype.centerOnMe = function () {
            selfMethods.centerOnMe();
        };
        function removeCanvas() {
            selfMethods.removeCanvas();
        }
        function centerOnMe() {
            selfMethods.centerOnMe();
        }

        function init() {
            console.log('CanvasHolderCtrl init');
            if (!isInstantiated) {
                var locApp = angular.module('mapModule');

                locApp.controller('CanvasHolderCtrl',  ['$scope', '$rootScope', '$uibModal', 'LinkrService', 'MapInstanceService', 'CanvasService', '$window', CanvasHolderCtrl]);
                // angular.bootstrap(document.getElementById('year'), ['example']);
                isInstantiated = true;
            }
            return {
                addCanvas : addCanvas,
                removeCanvas : removeCanvas,
                centerOnMe : centerOnMe
            }
        }

        return {
            start: init,
            addCanvas: addCanvas,
            removeCanvas : removeCanvas,
            centerOnMe : centerOnMe
        };
    });
}());
