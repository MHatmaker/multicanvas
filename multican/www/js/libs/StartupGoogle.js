/*global require, define, google, console, document, loading, window, dojo*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupGoogle setup');

    define([
        'libs/MapHosterGoogle',
        'controllers/PusherSetupCtrl',
        'libs/MLConfig',
        'libs/utils'
    ], function (MapHosterGoogle, PusherSetupCtrl, MLConfig, utils) {
        console.log('StartupGoogle define');
        var
            StartupGoogle = function (mapNo, mapconfig) {
                console.log("StartupGoogle ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
                this.newSelectedWebMapId = '';
                this.pusherChannel = null;
                this.pusher = null;
                this.mlconfig = mapconfig; //MLConfig.getInstance();
                this.mlconfig.setMapNumber(mapNo);

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
                            mapInstanceSvc,
                            centerLatLng,
                            initZoom,
                            mapOptions = {};
                            // qlat,
                            // qlon,
                            // bnds,
                            // zoomStr;

                        console.log("StartupGoogle configure with map no. " + self.mapNumber);
                        self.newSelectedWebMapId = newMapId;

                        window.loading = dojo.byId("loadingImg");
                        utils.showLoading();
                        // var centerLatLng = new google.maps.LatLng(41.8, -87.7);
                        centerLatLng = new google.maps.LatLng(mapOpts.center.lat, mapOpts.center.lng);
                        initZoom = 15;

                        // if (mapOpts) {
                        //     centerLatLng = mapOpts.center;
                        //     initZoom = mapOpts.zoom;
                        // }

                        mapOptions = {
                            center: centerLatLng, //new google.maps.LatLng(41.8, -87.7),
                            // center: new google.maps.LatLng(51.50, -0.09),
                            zoom: initZoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        self.gMap = new google.maps.Map(document.getElementById("map" + self.mapNumber), mapOptions);
                        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + self.mapNumber);
                        self.mapHoster = new MapHosterGoogle.start();
                        self.mapHoster.config(self.gMap, self.mapNumber, mapOptions, google, google.maps.places, self.mlconfig);

                        $inj = self.mlconfig.getInjector(); // angular.injector(['mapModule']);
                        // evtSvc = $inj.get('PusherEventHandlerService');
                        // evtSvc.addEvent('client-MapXtntEvent', self.mapHoster.retrievedBounds);
                        // evtSvc.addEvent('client-MapClickEvent',  self.mapHoster.retrievedClick);
                        mapInstanceSvc = $inj.get('MapInstanceService');
                        mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);

                        self.pusherChannel = self.mlconfig.masherChannel(false);
                        console.debug(self.pusherChannel);
                        self.pusher = PusherSetupCtrl.createPusherClient(
                            {
                                'client-MapXtntEvent' : self.mapHoster.retrievedBounds,
                                'client-MapClickEvent' : self.mapHoster.retrievedClick,
                                'client-NewMapPosition' : self.mapHoster.retrievedNewPosition
                            },
                            self.pusherChannel,
                            self.mlconfig,
                            function (channel, userName) {
                                self.mlconfig.setUserName(userName);
                            }
                        );
                        if (!self.pusher) {
                            console.log("failed to create Pusher in StartupGoogle");
                        }
                        // return self.mapHoster;
                    },

                    // function getMapHoster() {
                    //     console.log('StartupGoogle return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }

                    init = function () {
                        console.log('StartupGoogle init');
                        return StartupGoogle;
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
            StartupGoogle: StartupGoogle
        };
    });
}());
