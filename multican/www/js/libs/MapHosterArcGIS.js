/*global require, define, google, console, document*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('MapHosterArcGIS setup');

    define([
        'libs/MLConfig'
    ], function (MLConfig) {
        console.log('MapHosterArcGIS define');
        var
            MapHosterArcGIS = function (mapNo) {
                console.log("MapHosterArcGIS ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
                console.log("Setting mapNumber to " + this.mapNumber);
                var self = this,

                    getMap = function () {
                        return self.gMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },

                    configure = function (newMapId, mapOpts) {
                        var $inj,
                            evtSvc,
                            centerLatLng,
                            initZoom,
                            mapOptions = {},
                            qlat,
                            qlon,
                            bnds,
                            zoomStr;

                        console.log("MapHosterArcGIS configure with map no. " + self.mapNumber);
                        // var centerLatLng = new google.maps.LatLng(41.8, -87.7);
                        centerLatLng = new google.maps.LatLng(mapOpts.center.lat, mapOpts.center.lng);
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

                        self.gMap = new google.maps.Map(document.getElementById("map" + self.mapNumber), mapOptions);
                        console.log('MapHosterArcGIS ready to instantiate Map Hoster with map no. ' + self.mapNumber);
                        self.mapHoster = new MapHosterArcGIS.MapHosterGoogle(self.gMap, self.mapNumber, mapOptions, google, google.maps.places);
                        // return self.mapHoster;
                    },

                    // function getMapHoster() {
                    //     console.log('MapHosterArcGIS return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }

                    init = function () {
                        console.log('MapHosterArcGIS init');
                        return MapHosterArcGIS;
                    };
                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: configure,
                    init: init
                };
            };

        return {
            MapHosterArcGIS: MapHosterArcGIS
        };
    });
}());
