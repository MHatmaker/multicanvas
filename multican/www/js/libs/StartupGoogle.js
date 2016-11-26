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
            mapHosters = [],
            mapNumber;

        function getMap() {
            return gMap;
        }

        function getMapNumber() {
            return mapNumber;
        }

        function configure(newMapId, mapOpts) {
            var $inj,
                mapHoster = null,
                evtSvc,
                centerLatLng,
                initZoom,
                mapOptions = {},
                qlat,
                qlon,
                bnds,
                zoomStr;

            console.log("StartupGoogle configure with map no. " + mapNumber);
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
            console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + mapNumber);
            mapHoster = new MapHosterGoogle(gMap, mapNumber, mapOptions, google, google.maps.places);
            mapHosters.push(mapHoster);
            // mapHoster.start();
            // mapHoster.config();
            return mapHoster;
        }

        // function getMapHoster() {
        //     console.log('StartupGoogle return mapHoster with map no. ' + mapHoster.getMapNumber());
        //     return mapHoster;
        // }

        function init() {
            console.log('StartupGoogle init');
            return StartupGoogle;
        }

        StartupGoogle = function (mapNo) {
            console.log("StartupGoogle ctor");
            mapNumber = mapNo;
            console.log("Setting mapNumber to " + mapNumber);
            return {
                start: init,
                config : configure,
                getMap : getMap,
                // getMapHoster : getMapHoster,
                mapNumber : mapNumber,
                getMapNumber : getMapNumber
            };
        };

        return StartupGoogle;

    });
}());
