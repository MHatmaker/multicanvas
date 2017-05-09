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
                this.mlconfig.setUserId(this.mlconfig.getUserName() + mapNo);

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

                    configure = function (newMapId, mapLocOpts) {
                        var $inj,
                            mapInstanceSvc,
                            centerLatLng,
                            initZoom,
                            mapGoogleLocOpts = {};
                            // qlat,
                            // qlon,
                            // bnds,
                            // zoomStr;

                        console.log("StartupGoogle configure with map no. " + self.mapNumber);
                        self.newSelectedWebMapId = newMapId;

                        window.loading = dojo.byId("loadingImg");
                        utils.showLoading();
                        // var centerLatLng = new google.maps.LatLng(41.8, -87.7);
                        centerLatLng = new google.maps.LatLng(mapLocOpts.center.lat, mapLocOpts.center.lng);
                        initZoom = mapLocOpts.zoom;

                        // if (mapLocOpts) {
                        //     centerLatLng = mapLocOpts.center;
                        //     initZoom = mapLocOpts.zoom;
                        // }

                        mapGoogleLocOpts = {
                            center: centerLatLng, //new google.maps.LatLng(41.8, -87.7),
                            // center: new google.maps.LatLng(51.50, -0.09),
                            zoom: initZoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        self.gMap = new google.maps.Map(document.getElementById("map" + self.mapNumber), mapGoogleLocOpts);
                        console.log('StartupGoogle ready to instantiate Map Hoster with map no. ' + self.mapNumber);
                        self.mapHoster = new MapHosterGoogle.MapHosterGoogle();
                        self.mapHoster.config(self.gMap, mapGoogleLocOpts, google, google.maps.places, self.mlconfig);
                        self.mlconfig.setMapHosterInstance(self.mapHoster);

                        $inj = self.mlconfig.getInjector(); // angular.injector(['mapModule']);
                        // evtSvc = $inj.get('PusherEventHandlerService');
                        // evtSvc.addEvent('client-MapXtntEvent', self.mapHoster.retrievedBounds);
                        // evtSvc.addEvent('client-MapClickEvent',  self.mapHoster.retrievedClick);
                        mapInstanceSvc = $inj.get('MapInstanceService');
                        mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);

                        self.pusher = PusherSetupCtrl.createPusherClient(
                            self.mlconfig,
                            function (channel, userName) {
                                self.mlconfig.setUserName(userName);
                            },
                            null
                        );
                        if (!self.pusher) {
                            console.log("failed to create Pusher in StartupGoogle");
                        }
                        // return self.mapHoster;
                    };

                    // function getMapHoster() {
                    //     console.log('StartupGoogle return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }
                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: configure
                };
            };

        return {
            StartupGoogle: StartupGoogle
        };
    });
}());
