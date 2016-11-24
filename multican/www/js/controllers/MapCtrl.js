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
                    mapStartup;
                console.log("MLConfig id is " + configMapNumber);
                $scope.mapheight = 450;
                $scope.mapwidth = 380;

                function initialize(mapNo) {
                    mapNumber = mapNo;
                    console.log("initialize MapCtrl with map id " + mapNo);
                    var myLatlng = new google.maps.LatLng(43.07493, -89.381388),

                        mapOptions = {
                            center: myLatlng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                    mapStartup = new StartupGoogle();
                    mapStartup.config(mapNumber, configMapNumber, mapOptions);
                    $scope.map = mapStartup.getMap();
                    MapInstanceService.setMapHosterInstance(mapNumber, mapStartup.getMapHoster());
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
