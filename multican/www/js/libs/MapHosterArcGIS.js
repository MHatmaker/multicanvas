/*global require, define, google, console, document*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('MapHosterArcGIS setup');

    define([
        'libs/utils',
        'libs/MLConfig',
        'libs/PusherConfig'
    ], function (utils, MLConfig, PusherConfig) {
        console.log('MapHosterArcGIS define');
        var
            MapHosterArcGIS = function (aMap, mapNo, mlconfig) {
                console.log("MapHosterArcGIS ctor");
                this.mapNumber = mapNo;
                this.aMap = aMap;
                this.mlconfig = mlconfig;
                console.log("Setting mapNumber to " + this.mapNumber);
                var self = this,
                    selfPusherDetails = {
                        channel : null,
                        pusher : null
                    },

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
                    setPusherClient = function(pusher, channel) {
                        console.log("MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        var $inj = self.mlconfig.getInjector(),
                            evtSvc = $inj.get('PusherEventHandlerService'),
                            evtDct = evtSvc.getEventDct(),
                            key;

                        if (selfPusherDetails.pusher === null) {
                            selfPusherDetails.pusher = pusher;
                            selfPusherDetails.channel = channel;
                            self.pusherconfig.setChannel(channel);

                            $inj = self.mlconfig.getInjector();
                            evtSvc = $inj.get('PusherEventHandlerService');
                            evtDct = evtSvc.getEventDct();
                            for (key in evtDct) {
                                if (evtDct.hasOwnProperty(key)) {
                                    pusher.subscribe(key, evtDct[key]);
                                }
                            }

                            // pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
                            // pusher.subscribe( 'client-MapClickEvent', retrievedClick);
                            // pusher.subscribe( 'client-NewMapPosition', retrievedNewPosition);
                            console.log("reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        }
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
                    init: init,
                    setPusherClient: setPusherClient
                };
            };

        return {
            MapHosterArcGIS: MapHosterArcGIS
        };
    });
// }());
}).call(this);
