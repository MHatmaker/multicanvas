/*global angular, console, define, document, MLConfig */

(function () {
    "use strict";

    console.log("MLConfig setup");
    define([],
        function () {
            console.log("entering MLConfig");

            function getParameterByName(name) {
                // console.log("get paramater " + name + " from " + details.search);
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(self.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            var
                MLConfig = function (ndx) {
                    console.log("MLConfig ctor");
                    this.mapId = ndx;
                    this.mapHosterInstance = null;
                    console.log("mapId is set to " + this.mapId);
                    this.webmapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0";
                    var self = this,
                        details = {
                            nginj : null,
                            masherChannel : "private-channel-mashchannel",
                            masherChannelInitialized : false,
                            nameChannelAccepted : false,
                            userName: 'defaultuser'
                        },

                        setMapId = function (id) {
                            console.log("MLConfig setMapId to " + id);
                            self.mapId = id;
                            console.log("MapId is now " + self.mapId);
                        },
                        getMapId = function () {
                            return self.mapId;
                        },
                        masherChannel = function (newWindow) {
                            // alert(getParameterByName('channel'));
                            // alert(details.masherChannel);
                            return newWindow ? getParameterByName('channel') : details.masherChannel;
                        },
                        getChannelFromUrl = function () {
                            details.masherChannel = getParameterByName('channel');
                            details.masherChannelInitialized = true;
                            return details.masherChannel;
                        },
                        setChannel = function (chnl) {
                            if (details.masherChannelInitialized === false) {
                                details.masherChannelInitialized = true;
                            }
                            details.masherChannel = chnl;
                        },
                        isChannelInitialized = function () {
                            return details.masherChannelInitialized;
                        },

                        setNameChannelAccepted = function (tf) {
                            if (details.nameChannelAccepted === false) {
                                details.nameChannelAccepted = true;
                            }
                            details.nameChannelAccepted = tf;
                        },
                        isNameChannelAccepted = function () {
                            return details.nameChannelAccepted;
                        },
                        setMapHosterInstance = function (inst) {
                            self.mapHosterInstance = inst;
                            console.log("MLConfig.mapHosterInstance is set to " + self.mapHosterInstance.getMapNumber());
                            console.debug(self.mapHosterInstance);
                        },
                        getMapHosterInstance = function () {
                            console.log("MLConfig.mapHosterInstance is returning instance " + self.mapId);
                            console.debug(self.mapHosterInstance);
                            return self.mapHosterInstance;
                        },
                        setInjector = function (inj) {
                            self.nginj = inj;
                        },
                        getInjector = function () {
                            return self.nginj;
                        },
                        webmapId = function (newWindow) {
                            return newWindow ? getParameterByName('id') : self.webmapId;
                        },
                        setWebmapId = function (id) {
                            console.log("Setting webmapId to " + id);
                            self.webmapId = id;
                        },
                        getUserName = function () {
                            return details.userName;
                        },
                        getUserNameFromUrl = function () {
                            details.userName = getParameterByName('userName');
                            return details.userName;
                        },
                        setUserName = function (name) {
                            details.userName = name;
                        },
                        setInjector = function (inj) {
                            details.nginj = inj;
                        },
                        getInjector = function () {
                            return details.nginj;
                        };
                    setInjector(angular.element(document.body).injector());
                    return {
                        setMapId: setMapId,
                        getMapId: getMapId,
                        setMapHosterInstance: setMapHosterInstance,
                        getMapHosterInstance: getMapHosterInstance,
                        setUserName: setUserName,
                        getUserName: getUserName,
                        setInjector: setInjector,
                        getInjector: getInjector,
                        webmapId: webmapId,
                        setWebmapId: setWebmapId,
                        masherChannel: masherChannel,
                        getChannelFromUrl: getChannelFromUrl,
                        isChannelInitialized: isChannelInitialized,
                        isNameChannelAccepted: isNameChannelAccepted
                    };
                };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
