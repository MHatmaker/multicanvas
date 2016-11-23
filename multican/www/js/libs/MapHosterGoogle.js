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
            google,
            gMap;

        function init() {
            return MapHosterGoogle;
        }

        function configureMap(gMap, mapOptions, goooogle, googPlaces) {
            mphmap = gMap;
            google = goooogle;
        }

        function MapHosterGoogle() {
            return {
                start: init,
                config: configureMap
            }
        };
        return MapHosterGoogle;

    });

}());
