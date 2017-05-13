/*global angular, console, define, document, MLConfig */

define(function () {
    "use strict";
    console.log("entering MLConfig");

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
            details = {
                mapId : ndx,
                mapType : 'google',
                mapHosterInstance : null,
                mapNumber: null,
                mapHoster : null,
                webmapId : "a4bb8a91ecfb4131aa544eddfbc2f1d0",
                nginj : null,
                masherChannel : "private-channel-mashchannel",
                masherChannelInitialized : false,
                nameChannelAccepted : false,
                userName: 'defaultuser',
                search: '/',
                startupView : {'summaryShowing' : true, 'websiteDisplayMode' : true}
            },

            setMapId = function (id) {
                console.log("MLConfig setMapId to " + id);
                details.mapId = id;
                console.log("MapId is now " + details.mapId);
            },
            getMapId = function () {
                return details.mapId;
            },
            setMapType = function (type) {
                details.mapType = type;
            },
            getMapType = function () {
                return details.mapType;
            },
            setMapNumber = function (mapNo) {
                details.mapNumber = mapNo;
            },
            getMapNumber = function () {
                return details.mapNumber;
            },
            masherChannel = function (newWindow) {
                // alert(getParameterByName('channel'));
                // alert(details.masherChannel);
                return newWindow ? getParameterByName('channel', details) : details.masherChannel;
            },
            getChannelFromUrl = function () {
                details.masherChannel = getParameterByName('channel', details);
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
                details.mapHosterInstance = inst;
                console.log("MLConfig.mapHosterInstance is set to " + details.mapNumber);
                console.debug(details.mapHosterInstance);
            },
            getMapHosterInstance = function () {
                console.log("MLConfig.mapHosterInstance is returning instance " + details.mapId);
                console.debug(details.mapHosterInstance);
                return details.mapHosterInstance;
            },
            webmapId = function (newWindow) {
                return newWindow ? getParameterByName('id', details) : details.webmapId;
            },
            setWebmapId = function (id) {
                console.log("Setting webmapId to " + id);
                details.webmapId = id;
            },
            getUserName = function () {
                return details.userName;
            },
            getUserNameFromUrl = function () {
                details.userName = getParameterByName('userName', details);
                return details.userName;
            },
            setUserName = function (name) {
                details.userName = name;
            },
            getUserId = function () {
                return details.userId;
            },
            setUserId = function (id) {
                details.userId = id;
            },
            getReferrerId = function () {
                return details.referrerId;
            },
            getReferrerIdFromUrl = function () {
                details.referrerId = getParameterByName('referrerId');
                return details.referrerId;
            },
            setReferrerId = function (id) {
                details.referrerId = id;
            },
            getReferrerNameFromUrl = function () {
                details.referrerName = getParameterByName('referrerName');
                return details.referrerName;
            },
            testUrlArgs = function () {
                var rslt = getParameterByName('id', details);
                // alert("getParameterByName('id') = " + rslt);
                // alert(rslt.length);
                // alert(rslt.length != 0);

                console.log("getParameterByName('id') = " + rslt);
                console.log(rslt.length);
                console.log(rslt.length !== 0);
                return rslt.length !== 0;
            },

            setPosition = function (position) {
                details.lon = position.lon;
                details.lat = position.lat;
                details.zoom = position.zoom;
            },
            getPosition = function () {
                return {"webmapId" : details.webmapId, "mapType" : details.mapType, "lon" : details.lon, "lat" : details.lat, "zoom" : details.zoom};
            },

            setQuery = function (q) {
                details.query = q;
            },
            query = function () {
                return getParameterByName('gmquery', details);
            },
            getQueryFromUrl = function () {
                // details.query.push(getParameterByName('gmquery'));
                return details.query;
            },
            setBounds = function (bnds) {
                details.bounds = bnds;
            },
            getBounds = function () {
                return details.bounds;
            },
            setInjector = function (inj) {
                details.nginj = inj;
            },
            getInjector = function () {
                return details.nginj;
            },
            setStartupView = function (sum, site) {
                details.startupView.summaryShowing = sum;
                details.startupView.websiteDisplayMode = site;
            },
            getStartupView = function () {
                return details.startupView;
            },
            showConfigDetails = function (msg) {
                console.log(msg);
                console.log(
                    'isInitialUser ' + details.isInitialUser + "\n",
                    "  userId : "  + details.userId + ', userName ' + details.userName + "\n" +
                        "referrerId : "  + details.referrerId + "\n" +
                        "locationPath : "  + details.locationPath + "\n" +
                        "host : "  + details.host + "\n" +
                        "hostport : "  + details.hostport + "\n" +
                        "href : "  + details.href + "\n"  +
                        "search : "  + details.search + "\n" +
                        "maphost : "  + details.maphost + "\n" +
                        "webmapId : "  + details.webmapId + "\n" +
                        "masherChannel : "  + details.masherChannel + "\n" +
                        "lon :" + details.lon + '\n' +
                        "lat : " + details.lat + "\n" +
                        "zoom : " + details.zoom +
                        "startupView.summaryShowing : " + details.startupView.summaryShowing + ", startupView.websiteDisplayMode : " + details.startupView.websiteDisplayMode
                );
            };


        setInjector(angular.element(document.body).injector());
        return {
            setMapId: setMapId,
            getMapId: getMapId,
            getMapType: getMapType,
            setMapType: setMapType,
            getUserId: getUserId,
            setUserId: setUserId,
            getReferrerId: getReferrerId,
            getReferrerIdFromUrl: getReferrerIdFromUrl,
            getReferrerNameFromUrl: getReferrerNameFromUrl,
            setReferrerId: setReferrerId,
            setMapNumber: setMapNumber,
            getMapNumber: getMapNumber,
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
            getUserNameFromUrl: getUserNameFromUrl,
            testUrlArgs: testUrlArgs,
            setPosition: setPosition,
            getPosition: getPosition,
            getBounds: getBounds,
            setBounds: setBounds,
            showConfigDetails: showConfigDetails,
            getStartupView: getStartupView,
            setStartupView: setStartupView,
            query: query,
            setQuery: setQuery,
            getQueryFromUrl: getQueryFromUrl
        };
    }

    return {
        MLConfig : function (ndx) {
            return init(ndx);
        }
    };
}());
