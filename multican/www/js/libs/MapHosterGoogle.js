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
            google,
            MapHosterGoogle = function (gMap, mapno, mapOptions, goooogle, googPlaces) {
                this.mphmap = gMap;
                this.mapNumber = mapno;
                google = goooogle;
            };

        MapHosterGoogle.prototype.init = function () {
            console.log("empty init method in MapHosterGoogle");
        };

        MapHosterGoogle.prototype.getMapNumber = function () {
            return this.mapNumber;
        };

        MapHosterGoogle.prototype.centerOnMe = function () {
            var self = this;
            console.log("centerOnMe for map " + this.mapNumber);
            navigator.geolocation.getCurrentPosition(function (pos) {
                self.mphmap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
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
