/*global require, define, google, console, document*/
/*jslint unparam: true*/

(function () {
    "use strict";
    // require(['libs/MapHosterGoogle', 'libs/MLConfig']);

    console.log('StartupGoogle setup');
    define([
        'libs/MapHosterGoogle',
        'libs/MLConfig'
    ], function (MapHosterGoogle, MLConfig) {
        console.log('StartupGoogle define');
        var
            gMap = null,
            StartupGoogle,
            mapHoster = null;

        function getMap() {
            return gMap;
        }

        function configure(mapNumber, newMapId, mapOpts) {
            var $inj,
                evtSvc,
                centerLatLng,
                initZoom,
                mapOptions = {},
                qlat,
                qlon,
                bnds,
                zoomStr;

            // var centerLatLng = new google.maps.LatLng(41.8, -87.7);
            centerLatLng = new google.maps.LatLng(41.888996, -87.623294);
            initZoom = 15;

            if (mapOpts) {
                centerLatLng = mapOpts.center;
                initZoom = mapOpts.zoom;
            }

            mapOptions = {
                center: centerLatLng, //new google.maps.LatLng(41.8, -87.7),
                // center: new google.maps.LatLng(51.50, -0.09),
                zoom: initZoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            gMap = new google.maps.Map(document.getElementById("map" + mapNumber), mapOptions);
            // gMap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            mapHoster = new MapHosterGoogle();
            mapHoster.start();
            mapHoster.config(gMap, mapNumber, mapOptions, google, google.maps.places);
        }

        function getMapHoster() {
            return mapHoster;
        }

        function init() {
            console.log('StartupGoogle init');
            return StartupGoogle;
        }

        StartupGoogle = function () {
            console.log("StartupGoogle ctor");
            return {
                start: init,
                config : configure,
                getMap : getMap,
                getMapHoster : getMapHoster
            }
        };

        return StartupGoogle;

    });
}());
