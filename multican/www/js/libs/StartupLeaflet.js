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
                this.mlconfig = mlconfig;
                var
                    lMap,
                    // mph = null,
                    newSelectedWebMapId = "",
                    pusher = null,
                    pusherChannel = null,
                    self = this,

                    getMap = function () {
                        return lMap;
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
                            evtSvc = $inj.get('PusherEventHandlerService');
                        newSelectedWebMapId = newMapId;
                        window.loading = dojo.byId("loadingImg");
                        console.log(window.loading);
                        console.log("newSelectedWebMapId " + newMapId);
                        if (newSelectedWebMapId !== null) {
                            if (self.mlconfig.isChannelInitialized() === false) {
                                evtSvc.addEvent('client-MapXtntEvent', MapHosterLeaflet.retrievedBounds);
                                evtSvc.addEvent('client-MapClickEvent',  MapHosterLeaflet.retrievedClick);

                                // PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                                //     self.mlconfig.getUserName(), openNewDisplay,
                                //         {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});

                                PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                                    self.mlconfig.getUserName(), function (channel, userName) {
                                        self.mlconfig.setUserName(userName); /*,openNewDisplay, how did this get in here?
                                            {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId};*/
                                        openAGOWindow(channel, userName);
                                    });
                            } else {
                                openAGOWindow(self.mlconfig.masherChannel(false));
                            }
                        } else {
                            evtSvc.addEvent('client-MapXtntEvent', MapHosterLeaflet.retrievedBounds);
                            evtSvc.addEvent('client-MapClickEvent',  MapHosterLeaflet.retrievedClick);

                            // lMap = new L.Map('map_canvas', {loadingControl: true}); //.setView([41.8, -87.7], 13);

                            if (lMap) {
                                // lMap.remove();
                                lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                            } else {
                                lMap = new L.Map(document.getElementById("map" + self.mapNumber));
                            }

                            MapHosterLeaflet.start();
                            MapHosterLeaflet.config(lMap);

                            pusherChannel = self.mlconfig.masherChannel(false);
                            console.debug(pusherChannel);
                            pusher = PusherSetupCtrl.createPusherClient(
                                {
                                    'client-MapXtntEvent' : MapHosterLeaflet.retrievedBounds,
                                    'client-MapClickEvent' : MapHosterLeaflet.retrievedClick,
                                    'client-NewMapPosition' : MapHosterLeaflet.retrievedNewPosition
                                },
                                pusherChannel,
                                self.mlconfig.getUserName(),
                                function (channel, userName) {
                                    mlconfig.setUserName(userName);
                                },
                                null
                                // {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId}
                            );
                            if (!pusher) {
                                console.log("createPusherClient failed in StartupLeaflet");
                            }
                        }
                    },

                    init = function () {
                        console.log('StartupLeaflet init');
                        return StartupLeaflet;
                    };

                return {
                    start: init,
                    configure : configure,
                    getMap: getMap
                };
            };
        return {
            StartupLeaflet: StartupLeaflet
        };
    });
}());
