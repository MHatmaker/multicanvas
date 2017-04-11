/*global require, define, L, dojo, google, console, window, document*/
/*jslint unparam: true*/

(function () {
    "use strict";
    // require(['lib/MapHosterLeaflet']);

    console.log('StartupLeaflet setup');
    define([
        'libs/MapHosterLeaflet',
        'controllers/PusherSetupCtrl',
        'libs/MLConfig'
    ], function (MapHosterLeaflet, PusherSetupCtrl, MLConfig) {
        console.log('StartupLeaflet define');
        var
            StartupLeaflet = function (mapNo, mlconfig) {
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.lMap = null;
                this.mlconfig = mlconfig;
                this.newSelectedWebMapId = '';
                this.pusherChannel = null;
                this.pusher = null;
                this.mlconfig = mlconfig; //MLConfig.getInstance();
                this.mlconfig.setMapNumber(mapNo);

                console.log("Setting mapNumber to " + this.mapNumber);
                var
                    self = this,
                    getMap = function () {
                        return lMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },
                    openAGOWindow = function (channel, userName) {
                        var url = "?id=" + newSelectedWebMapId + MapHosterLeaflet.getGlobalsForUrl() + "&channel=" + channel + "&userName=" + userName;
                        console.log("open new ArcGIS window with URI " + url);
                        console.log("using channel " + channel + " with user name " + userName);
                        self.mlconfig.setUrl(url);
                        self.mlconfig.setChannel(channel);
                        self.mlconfig.userName(userName);
                        window.open(self.mlconfig.gethref() + "arcgis/" + url, newSelectedWebMapId, self.mlconfig.getSmallFormDimensions());
                    },

                    configure = function (newMapId) {
                        var $inj = self.mlconfig.getInjector(),
                            evtSvc = $inj.get('PusherEventHandlerService'),
                            CurrentMapTypeService;
                        self.newSelectedWebMapId = newMapId;
                        CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                        CurrentMapTypeService.setCurrentMapType('leaflet');
                        window.loading = dojo.byId("loadingImg");
                        console.log(window.loading);
                        console.log("newSelectedWebMapId " + newMapId);
                        // if (self.newSelectedWebMapId !== null) {
                        //     if (self.mlconfig.isChannelInitialized() === false) {
                        //         // PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                        //         //     self.mlconfig.getUserName(), openNewDisplay,
                        //         //         {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        //
                        //         PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                        //             self.mlconfig.getUserName(), function (channel, userName) {
                        //                 self.mlconfig.setUserName(userName); /*,openNewDisplay, how did this get in here?
                        //                     {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId};*/
                        //                 openAGOWindow(channel, userName);
                        //             });
                        //     } else {
                        //         openAGOWindow(self.mlconfig.masherChannel(false));
                        //     }
                        // } else {


                            if (self.lMap) {
                                // lMap.remove();
                                self.lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                            } else {
                                self.lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                            }

                            self.mapHoster = new MapHosterLeaflet.start();
                            self.mapHoster.config(self.gMap, self.mapNumber, self.mlconfig);
                            $inj = self.mlconfig.getInjector(); // angular.injector(['mapModule']);
                            evtSvc = $inj.get('PusherEventHandlerService');
                            evtSvc.addEvent('client-MapXtntEvent', self.mapHoster.retrievedBounds);
                            evtSvc.addEvent('client-MapClickEvent',  self.mapHoster.retrievedClick);
                            CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                            CurrentMapTypeService.setCurrentMapType('leaflet');
                            mapInstanceSvc = $inj.get('MapInstanceService');
                            mapInstanceSvc.setMapHosterInstance(self.mapNumber, self.mapHoster);
                            self.pusherChannel = self.mlconfig.masherChannel(false);
                            console.debug(self.pusherChannel);
                            self.pusher = PusherSetupCtrl.createPusherClient(
                                {
                                    'client-MapXtntEvent' : MapHosterLeaflet.retrievedBounds,
                                    'client-MapClickEvent' : MapHosterLeaflet.retrievedClick,
                                    'client-NewMapPosition' : MapHosterLeaflet.retrievedNewPosition
                                },
                                self.pusherChannel,
                                self.mlconfig.getUserName(),
                                function (channel, userName) {
                                    self.mlconfig.setUserName(userName);
                                },
                                null
                                // {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId}
                            );
                            if (!self.pusher) {
                                console.log("createPusherClient failed in StartupLeaflet");
                            }
                        // }
                    },

                    init = function () {
                        console.log('StartupLeaflet init');
                        return StartupLeaflet;
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
            StartupLeaflet: StartupLeaflet
        };
    });
}());
