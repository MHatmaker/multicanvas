/*global define, console, google, document, window*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'services/CanvasService',
        'services/SimpleSlides',
        'services/MapInstanceService'
    ], function (app) {

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            '$compile',
            'CanvasService',
            'MapInstanceService',
            function ($scope, $compile, CanvasService,  MapInstanceService) {
                var mapNumber = MapInstanceService.getMapNumber();

                function initialize(mapNo) {
                    mapNumber = mapNo;
                    console.log("initialize MapCtrl with map id " + mapNo);
                    var myLatlng = new google.maps.LatLng(43.07493, -89.381388),

                        mapOptions = {
                            center: myLatlng,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        },
                        map = new google.maps.Map(document.getElementById("map" + mapNumber),
                            mapOptions),

                        //Marker + infowindow + angularjs compiled ng-click
                        contentString = "<div><a ng-click='clickTest()'>Click me from map " + mapNumber + "!</a></div>",
                        compiled = $compile(contentString)($scope),

                        infowindow = new google.maps.InfoWindow({
                            content: compiled[0]
                        }),

                        marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: 'Uluru (Ayers Rock)'
                        });

                    // MapInstanceService.incrementMapNumber();
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });

                    $scope.map = map;
                }
                // google.maps.event.addDomListener(window, 'load', initialize);
                $scope.startMap = function (mapNumber) {
                    initialize(mapNumber);
                }

                $scope.centerOnMe = function () {
                    if(!$scope.map) {
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(function(pos) {
                        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                        $scope.loading.hide();
                      }, function(error) {
                          alert('Unable to get location: ' + error.message);
                    });
                };

                $scope.clickTest = function() {
                    alert('infowindow with ng-click on map ' + mapNumber);
                };
                // initialize();


          }
        ]);
    });
}());
