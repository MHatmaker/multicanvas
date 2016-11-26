/*global define, console, google, document, window, navigator, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'libs/MLConfig',
        'libs/StartupGoogle'
    ], function (app, MLConfig, StartupGoogle) {

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            '$compile',
            'MapInstanceService',
            function ($scope, $compile, MapInstanceService) {
                var mapNumber = MapInstanceService.getMapNumber(),
                    mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                    configMapNumber = mapConfig.getMapId(),
                    mapStartups = [],
                    mapStartup,
                    mapNumber;
                console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                $scope.mapheight = 450;
                $scope.mapwidth = 380;

                function initialize(mapNo) {
                    var mapHoster;

                    mapNumber = mapNo;
                    console.log("initialize MapCtrl with map id " + mapNo);
                    var myLatlng = new google.maps.LatLng(43.07493, -89.381388),

                        mapOptions = {
                            center: myLatlng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                    mapStartup = new StartupGoogle(mapNumber);
                    mapStartups.push(mapStartup);
                    mapStartup.config(configMapNumber, mapOptions);
                    console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.mapNumber);
                    console.log("Try accessor " + mapStartup.getMapNumber());
                    $scope.map = mapStartup.getMap();
                    mapHoster = mapStartup.getMapHoster();
                    console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
                    MapInstanceService.setMapHosterInstance(mapNumber, mapHoster);
                }
                // google.maps.event.addDomListener(window, 'load', initialize);
                $scope.startMap = function (mapNumber) {
                    initialize(mapNumber);
                };

                $scope.clickTest = function () {
                    alert('infowindow with ng-click on map ' + mapNumber);
                };
                // initialize();


            }
        ]);

    });
}());
