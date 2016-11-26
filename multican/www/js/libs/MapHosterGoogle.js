/*global require, define, console, google*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log("ready to require stuff in MapHosterGoogle");

    define([
        'libs/MLConfig'
    ], function (MLConfig) {

        var
            hostName = "MapHosterGoogle",
            mphmap,
            mapNumber,
            google,
            gMap;

        function init() {
            return MapHosterGoogle;
        }

        function getMapNumber() {
            return mapNumber;
        }

        function configureMap(gMap, mapno, mapOptions, goooogle, googPlaces) {
            mphmap = gMap;
            mapNumber = mapno;
            google = goooogle;
            console.log("MapHosterGoogle setting mapNumber to " + mapNumber);
        }
        function centerOnMe() {
            console.log("centerOnMe for map " + mapNumber);
            navigator.geolocation.getCurrentPosition(function (pos) {
                mphmap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                //$scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        function MapHosterGoogle() {
            return {
                start: init,
                config: configureMap,
                centerOnMe: centerOnMe,
                mapNumber: mapNumber,
                getMapNumber: getMapNumber
            }
        };
        return MapHosterGoogle;

    });

}());
