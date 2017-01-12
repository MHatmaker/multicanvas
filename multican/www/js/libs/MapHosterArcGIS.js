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
            MapHosterArcGIS = function (aMap, mapNo, mlconfig) {
                console.log("MapHosterArcGIS ctor");
                this.mapNumber = mapNo;
                this.aMap = aMap;
                this.mlconfig = mlconfig;
                console.log("Setting mapNumber to " + this.mapNumber);
                var self = this,

                    getMap = function () {
                        return self.aMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },

                    configure = function (newMapId, mapOpts) {
                        // var $inj,
                        //     evtSvc,
                        //     centerLatLng,
                        //     initZoom,
                        //     mapOptions = {},
                        //     qlat,
                        //     qlon,
                        //     bnds,
                        //     zoomStr;

                        console.log("MapHosterArcGIS configure with map no. " + self.mapNumber);
                    },
                    init = function () {
                        console.log('MapHosterArcGIS init');
                        return MapHosterArcGIS;
                    };
                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    config: configure,
                    init: init
                };
            };

        return {
            MapHosterArcGIS: MapHosterArcGIS
        };
    });
}());
