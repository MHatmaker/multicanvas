/*global require, define, console, google, navigator, alert*/
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
            MapHosterGoogle = function (gMap, mapno, mapOptions, goooogle, googPlaces) {
                mphmap = gMap;
                mapNumber = mapno;
                google = goooogle;
            };

        MapHosterGoogle.prototype.init = function () {
            console.log("empty init method in MapHosterGoogle");
        };

        MapHosterGoogle.prototype.getMapNumber = function () {
            return mapNumber;
        };

        // function configureMap() {
        //     mphmap = gMap;
        //     mapNumber = mapno;
        //     google = goooogle;
        //     console.log("MapHosterGoogle setting mapNumber to " + mapNumber);
        // }
        MapHosterGoogle.prototype.centerOnMe = function () {
            console.log("centerOnMe for map " + mapNumber);
            navigator.geolocation.getCurrentPosition(function (pos) {
                mphmap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                //$scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        return {
            MapHosterGoogle: MapHosterGoogle
        };

    });

}());
