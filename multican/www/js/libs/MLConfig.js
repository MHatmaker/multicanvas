/*global angular, console, define, document, MLConfig */

define(function () {
    "use strict";
    console.log("entering MLConfig");
    var staticMethods = {};

    function MLConfig(ndx) {
        console.log("MLConfig ctor");

        console.log("mapId to be set to " + ndx);

        var
            details = {
                mapId : ndx,
                mapType : 'google',
                mapHosterInstance : null,
                mapNumber: null,
                mapHoster : null,
                webmapId : "a4bb8a91ecfb4131aa544eddfbc2f1d0",
                lat : '',
                lon : '',
                zoom : '',
                nginj : null,
                protocol : 'http',
                host : '', //"http://localhost",
                hostport : '3035',
                href : '', //"http://localhost",
                search: '/',
                startupView : {'summaryShowing' : true, 'websiteDisplayMode' : true},
                smallFormDimensions : { 'top' : 1, 'left' : 1, 'width' : 450, 'height' : 570}
            },
            getParameterByName = function (name, details) {
                // console.log("get paramater " + name + " from " + details.search);
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(details.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
            setMapHosterInstance = function (inst) {
                details.mapHosterInstance = inst;
                if (!inst) {
                    console.log("attempting to setMapHosterInstance to null/undefined");
                }
                console.log("MLConfig.setMapHosterInstance is set to " + details.mapNumber);
                console.debug(details.mapHosterInstance);
            },
            getMapHosterInstance = function () {
                console.log("MLConfig.getMapHosterInstance is returning instance " + details.mapId);
                console.debug(details.mapHosterInstance);
                if (!details.mapHosterInstance) {
                    console.log("attempting to getMapHosterInstance containing null/undefined");
                }
                return details.mapHosterInstance;
            },
            getWebmapId = function (newWindow) {
                var result = "";
                if (newWindow === true) {
                    result = getParameterByName('id', details);
                    if (result === "") {
                        result = details.webmapId;
                    }
                } else {
                    result = details.webmapId;
                }
                return result;
            },
            setWebmapId = function (id) {
                console.log("Setting webmapId to " + id);
                details.webmapId = id;
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

            setUrl = function (u) {
                details.url = u;
            },
            getUrl = function () {
                return details.url;
            },
            getbaseurl = function () {
                var baseurl = details.protocol + "//" + details.host + "/";
                console.log("getbaseurl --> " + baseurl);
                return baseurl;
            },
            sethost = function (h) {
                details.host = h;
                console.log("host : " + details.host);
            },
            gethost = function () {
                return details.host;
            },
            hasCoordinates = function () {
                var result = "";
                result = getParameterByName('zoom', details);
                return result === "" ? false : true;
            },
            lon = function () {
                return getParameterByName('lon', details);
            },
            lat = function () {
                return getParameterByName('lat', details);
            },
            zoom = function () {
                return getParameterByName('zoom', details);
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
            getBoundsForUrl = function () {
                var bnds = details.bounds,
                    bndsUrl = "&llx=" + bnds.llx + "&lly=" + bnds.lly + "&urx=" + bnds.urx + "&ury=" + bnds.ury;
                return bndsUrl;
            },
            getBoundsFromUrl = function () {
                var llx = getParameterByName('llx'),
                    lly = getParameterByName('lly'),
                    urx = getParameterByName('urx'),
                    ury = getParameterByName('ury');
                return {'llx' : llx, 'lly' : lly, 'urx' : urx, 'ury' : ury};
            },
            getSmallFormDimensions = function () {
                var d = details.smallFormDimensions,
                    ltwh = 'top={0}, left={1}, height={2},width={3}'.format(d.top, d.left, d.height, d.width);
                return ltwh;
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
                    'isInitialUser ' + details.isInitialUser + "\n" +
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
        staticMethods.showConfigDetails = showConfigDetails;


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
            setInjector: setInjector,
            getInjector: getInjector,
            getWebmapId: getWebmapId,
            setWebmapId: setWebmapId,
            getbaseurl: getbaseurl,
            testUrlArgs: testUrlArgs,
            sethost: sethost,
            gethost: gethost,
            setPosition: setPosition,
            getPosition: getPosition,
            getBounds: getBounds,
            setBounds: setBounds,
            showConfigDetails: showConfigDetails,
            getStartupView: getStartupView,
            setStartupView: setStartupView,
            query: query,
            setQuery: setQuery,
            getQueryFromUrl: getQueryFromUrl,
            lat: lat,
            lon: lon,
            zoom: zoom,
            hasCoordinates : hasCoordinates,
            setUrl: setUrl,
            getUrl: getUrl,
            getSmallFormDimensions: getSmallFormDimensions,
            getBoundsForUrl: getBoundsForUrl,
            getBoundsFromUrl: getBoundsFromUrl
        };
    }

    MLConfig.prototype.showConfigDetails = function () {
        staticMethods.showConfigDetails();
    };
    return {
        MLConfig : function (ndx) {
            return MLConfig(ndx);
        }
    };
}());
