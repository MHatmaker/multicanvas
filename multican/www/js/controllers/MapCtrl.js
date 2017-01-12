/*global define, require, console, google, document, window, navigator, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'libs/StartupGoogle',
        'libs/StartupArcGIS'
    ], function (app, StartupGoogle, StartupArcGIS) {
        var selfMethods = {},
            curMapTypeInitialized = false;

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            '$compile',
            'MapInstanceService',
            function ($scope, $compile, MapInstanceService) {
                var outerMapNumber = MapInstanceService.getSlideCount();
                // var mapNumber = MapInstanceService.getSlideCount(),
                //     mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                //     configMapNumber = mapConfig.getMapId();
                    // mapStartups = [];
                // console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                $scope.mapheight = 450;
                $scope.mapwidth = 380;
                $scope.mapHosterInstance = null;

                function invalidateCurrentMapTypeConfigured() {
                    curMapTypeInitialized = false;
                }
                selfMethods.invalidateCurrentMapTypeConfigured = invalidateCurrentMapTypeConfigured;

                function initialize(mapNo, mapType) {
                    var mapStartup,
                        mapHoster,
                        centerCoord,
                        mapOptions = null,
                        mapNumber = mapNo,
                        mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                        configMapNumber = mapConfig.getMapId(),
                        popmapString = "click me for map " + configMapNumber,
                        contentString = "<div><a ng-click='clickTest()'>" + popmapString + "</a></div>",
                        compiledMsg = $compile(contentString)($scope);

                    console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                    console.log("initialize MapCtrl with map id " + mapNo);
                    curMapTypeInitialized = true;
                    console.log("curMapTypeInitialized is " + curMapTypeInitialized);
                    centerCoord = { lat: 43.07493, lng: -89.381388};

                    mapOptions = {
                        center: centerCoord,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    if (mapType === 'google') {
                        mapStartup = new StartupGoogle.StartupGoogle(mapNumber);
                    } else {
                        mapStartup = new StartupArcGIS.StartupArcGIS(mapNumber, mapConfig);
                    }
                    // mapStartups.push(mapStartup);
                    mapStartup.configure(configMapNumber, mapOptions);
                    mapHoster = mapStartup.getMapHosterInstance(configMapNumber);
                    $scope.mapHosterInstance = mapHoster;
                    console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.mapNumber);
                    console.log("Try accessor " + mapStartup.getMapNumber());
                    // console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
                    MapInstanceService.setMapHosterInstance(mapNumber, mapHoster);
                    mapHoster.addPopup(compiledMsg[0], centerCoord);
                }
                // google.maps.event.addDomListener(window, 'load', initialize);
                $scope.startMap = function (mapNumber, mapType) {
                    initialize(mapNumber, mapType);
                };

                $scope.clickTest = function () {
                    alert('infowindow with ng-click on map ' + outerMapNumber);
                };
                // initialize();
                $scope.$on('invalidateCurrentMapTypeConfigured', function () {
                    invalidateCurrentMapTypeConfigured();
                });


            }
        ]);

        function invalidateCurrentMapTypeConfigured() {
            console.log("invalidateCurrentMapTypeConfigured");
            if (selfMethods.invalidateCurrentMapTypeConfigured) {
                selfMethods.invalidateCurrentMapTypeConfigured();
            }
        }

        return {
            invalidateCurrentMapTypeConfigured : invalidateCurrentMapTypeConfigured
        };
    });
// }());
}).call(this);
