/*global angular, console, define, document, MLConfig */

define(function () {
    "use strict";
    console.log("entering MLConfig");
    var instance;

    function init(ndx) {
        console.log("MLConfig ctor");

        console.log("mapId to be set to " + ndx);
        function getParameterByName(name, details) {
            // console.log("get paramater " + name + " from " + details.search);
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(details.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        var
            self = this,
            details = {
                mapId : ndx,
                mapHosterInstance : null,
                mapHoster : null,
                webmapId : "a4bb8a91ecfb4131aa544eddfbc2f1d0",
                nginj : null,
                masherChannel : "private-channel-mashchannel",
                masherChannelInitialized : false,
                nameChannelAccepted : false,
                userName: 'defaultuser',
                search: '/'
            },

            setMapId = function (id) {
                console.log("MLConfig setMapId to " + id);
                details.mapId = id;
                console.log("MapId is now " + details.mapId);
            },
            getMapId = function () {
                return details.mapId;
            },
            masherChannel = function (newWindow) {
                // alert(getParameterByName('channel'));
                // alert(details.masherChannel);
                return newWindow ? getParameterByName('channel', self.details) : self.details.masherChannel;
            },
            getChannelFromUrl = function () {
                details.masherChannel = getParameterByName('channel', self.details);
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
            webmapId = function (newWindow) {
                return newWindow ? getParameterByName('id', self.details) : self.details.webmapId;
            },
            setWebmapId = function (id) {
                console.log("Setting webmapId to " + id);
                self.webmapId = id;
            },
            getUserName = function () {
                return details.userName;
            },
            getUserNameFromUrl = function () {
                details.userName = getParameterByName('userName', self.details);
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
            isNameChannelAccepted: isNameChannelAccepted,
            setChannel: setChannel,
            setNameChannelAccepted: setNameChannelAccepted,
            getUserNameFromUrl: getUserNameFromUrl
        };
    }

    return {
        getInstance : function (ndx) {
            if (!instance) {
                instance = init(ndx);
            }
            return instance;
        }
    };
}());
