/*global define, console, google, document, window, navigator, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'libs/StartupGoogle'
    ], function (app, StartupGoogle) {

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            'MapInstanceService',
            function ($scope, MapInstanceService) {
                var mapNumber = MapInstanceService.getMapNumber(),
                    mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                    configMapNumber = mapConfig.getMapId();
                    // mapStartups = [];
                console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                $scope.mapheight = 450;
                $scope.mapwidth = 380;

                function initialize(mapNo) {
                    var mapStartup,
                        mapHoster,
                        myLatlng,
                        mapOptions = null;

                    mapNumber = mapNo;
                    console.log("initialize MapCtrl with map id " + mapNo);
                    myLatlng = new google.maps.LatLng(43.07493, -89.381388);

                    mapOptions = {
                        center: myLatlng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    mapStartup = new StartupGoogle(mapNumber);
                    // mapStartups.push(mapStartup);
                    mapHoster = mapStartup.config(configMapNumber, mapOptions);
                    console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.mapNumber);
                    console.log("Try accessor " + mapStartup.getMapNumber());
                    // $scope.map = mapStartup.getMap();
                    // mapHoster = mapStartup.getMapHoster();
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
