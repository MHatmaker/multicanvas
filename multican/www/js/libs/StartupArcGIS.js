/*global require, define, google, console, document, dojo, esri, alert, setTimeout, window */
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupArcGIS setup');
    var aMap = null;

    require(['libs/MapHosterArcGIS', 'libs/utils']);

    // dojo.require("esri.map");
    // dojo.require("esri.tasks.geometry");
    // dojo.require("esri.tasks.locator");
    // dojo.require("esri/geometry/webMercatorUtils");
    // dojo.require("esri.IdentityManager");
    // dojo.require("esri.dijit.Scalebar");
    // dojo.requi   re("esri.arcgis.utils");
    //dojo.require("dojo.parser");
    // require("esri.map");
    // require("esri.tasks.geometry");
    // require("esri.tasks.locator");
    // require("esri/geometry/webMercatorUtils");
    // require("esri.IdentityManager");
    // require("esri.dijit.Scalebar");
    // require("esri.arcgis.utils");

    define([
        'libs/MapHosterArcGIS',
        'libs/MLConfig',
        'libs/utils'
    ], function (MapHosterArcGIS, MLConfig, utils) {
        console.log('StartupArcGIS define');
        var
            StartupArcGIS = function (mapNo, mlconfig) {
                console.log("StartupArcGIS ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
                this.mlconfig = mlconfig;
                console.log("Setting mapNumber to " + this.mapNumber);
                function showLoading() {
                    utils.showLoading();
                    aMap.disableMapNavigation();
                    aMap.hideZoomSlider();
                }

                function hideLoading(error) {
                    utils.hideLoading(error);
                    aMap.enableMapNavigation();
                    aMap.showZoomSlider();
                }
                function placeCustomControls() {
                    var $inj = mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    mapCtrl.placeCustomControls();
                }

                function setupQueryListener() {
                    var $inj = mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    mapCtrl.setupQueryListener();
                }

                var
                    selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 ", // Requires a space after map ID
                    previousSelectedWebMapId = selectedWebMapId,
                    zoomWebMap = null,
                    pointWebMap = [null, null],
                    channel = null,
                    pusher,
                    pusherChannel,
                    self = this,

                    configOptions,

                    getMap = function () {
                        return self.gMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    getMapHosterInstance = function (ndx) {
                        return self.mapHoster;
                    },

                    initUI = function () {
                      //add scalebar or other components like a legend, overview map etc
                        // dojo.parser.parse();
                        console.debug(aMap);
                        var curmph = null,
                            $inj,
                            mapTypeSvc,
                            currentPusher,
                            currentChannel;

                        /* Scalebar refuses to appear on map.  It appears outside the map on a bordering control.
                        var scalebar = new esri.dijit.Scalebar({
                            map: aMap,
                            scalebarUnit:"english",
                            attachTo: "top-left"
                        });
                         */

                        console.log("start MapHoster with center " + pointWebMap[0] + ", " + pointWebMap[1] + ' zoom ' + zoomWebMap);
                        console.log("selfDetails.mph : " + self.mph);
                        if (self.mph === null) {
                            console.log("self.Details.mph is null");
                            // alert("StartupArcGIS.initUI : selfDetails.mph == null");

                            self.mph = MapHosterArcGIS.start();
                            // placeCustomControls();

                            MapHosterArcGIS.config(aMap, zoomWebMap, pointWebMap);
                            placeCustomControls();
                            setupQueryListener();
                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("StartupArcGIS.initUI : selfDetails.mph as initially null and should now be set");
                            console.debug(MapHosterArcGIS);
                            console.debug(pusherChannel);
                            curmph = null;

                            $inj = mlconfig.getInjector();
                            mapTypeSvc = $inj.get('CurrentMapTypeService');
                            curmph = mapTypeSvc.getSelectedMapType();
    /*
                            pusher = PusherSetupCtrl.createPusherClient(
                                {
                                    'client-MapXtntEvent' : MapHosterArcGIS.retrievedBounds,
                                    'client-MapClickEvent' : MapHosterArcGIS.retrievedClick,
                                    'client-NewMapPosition' : curmph.retrievedNewPosition
                                },
                                pusherChannel,
                                MLConfig.getUserName(),
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    MLConfig.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : curmph, 'newWindowId' : "windowIdPlaceholder"}
                            );
    */
                        } else {
                            console.log("self.mph is something or other");
                            currentPusher = pusher;
                            currentChannel = channel;
                            self.mph = MapHosterArcGIS.start();
                            MapHosterArcGIS.config(aMap, zoomWebMap, pointWebMap);

                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("use current pusher - now setPusherClient");
                            MapHosterArcGIS.setPusherClient(currentPusher, currentChannel);
                            placeCustomControls();  // MOVED TEMPORARILY on 3/15
                            setupQueryListener();
                        }
                    },

                    initializePostProc = function (newMapId) {
                        var
                            $inj,
                            mapOptions = {},
                            mapDeferred;

                        console.log("StartupArcGIS configure with map no. " + self.mapNumber);
                        //specify any default settings for your map
                        //for example a bing maps key or a default web map id
                        configOptions = {
                            // webmap: '4b99c1fb712d4fe694805717df5fadf2', // selectedWebMapId,
                            webmap: selectedWebMapId,
                            title: "",
                            subtitle: "",
                            //arcgis.com sharing url is used modify this if yours is different
                            sharingurl: "http://arcgis.com/sharing/content/items",
                            //enter the bing maps key for your organization if you want to display bing maps
                            bingMapsKey: "/*Please enter your own Bing Map key*/"
                        };

                        console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + self.mapNumber);
                        self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS(self.gMap, self.mapNumber, mapOptions, google, google.maps.places);
                        // return self.mapHoster;
                        esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
                        esri.config.defaults.io.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

                        //create the map using the web map id specified using configOptions or via the url parameter
                        // var cpn = new dijit.layout.ContentPane({}, "map_canvas").startup();

                        // dijit.byId("map_canvas").addChild(cpn).placeAt("map_canvas").startup();

                        try {
                            mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap, "map_canvas", {
                                mapOptions: {
                                    slider: true,
                                    nav: false,
                                    wrapAround180: true

                                },
                                ignorePopups: false,
                                bingMapsKey: configOptions.bingMapsKey,
                                geometryServiceURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"

                            });
                        } catch (err) {
                            console.log(err.message);
                            alert(err.message);
                        } finally {
                            console.log("finally???????????????");
                            //alert("why are we in finally?");
                        }

                        console.log("set up mapDeferred anonymous method");
                        try {
                            mapDeferred.then(function (response) {
                                console.log("mapDeferred.then");
                                self.mapHoster = mapDeferred;
                                if (previousSelectedWebMapId !== selectedWebMapId) {
                                    previousSelectedWebMapId = selectedWebMapId;
                                    //dojo.destroy(map.container);
                                }
                                if (aMap) {
                                    aMap.destroy();
                                }
                                aMap = response.map;
                                console.log("in mapDeferred anonymous method");
                                console.log("configOptions title " + configOptions.title);
                                console.debug("ItemInfo object " + response.itemInfo);
                                console.log("ItemInfo.item object " + response.itemInfo.item);
                                console.log("response title " + response.itemInfo.item.title);
                                dojo.connect(aMap, "onUpdateStart", showLoading);
                                dojo.connect(aMap, "onUpdateEnd", hideLoading);
                                dojo.connect(aMap, "onLoad", initUI);

                                setTimeout(function () {
                                    if (aMap.loaded) {
                                        initUI();
                                    } else {
                                        dojo.connect(aMap, "onLoad", initUI);
                                    }
                                }, 300);
                            }, function (error) {
                                // alert("Create Map Failed ");
                                console.log('Create Map Failed: ' + dojo.toJson(error));
                                console.log("Error: ", error.code, " Message: ", error.message);
                                mapDeferred.cancel();
                            });
                        } catch (err) {
                            console.log("deferred failed with err " + err.message);
                        }
                    },

                    // function getMapHoster() {
                    //     console.log('StartupArcGIS return mapHoster with map no. ' + mapHoster.getMapNumber());
                    //     return mapHoster;
                    // }

                    init = function () {
                        console.log('StartupArcGIS init');
                        return StartupArcGIS;
                    },
                    prepareWindow = function (newSelectedWebMapId, referringMph, displayDestination) {

                        var curmph = MapHosterArcGIS,
                            $inj,
                            mapTypeSvc,
                            evtSvc,
                            url,
                            baseUrl,
                            openNewDisplay;

                        $inj = mlconfig.getInjector();
                        mapTypeSvc = $inj.get('CurrentMapTypeService');
                        curmph = mapTypeSvc.getSelectedMapType();

                        evtSvc = $inj.get('PusherEventHandlerService');
                        evtSvc.addEvent('client-MapXtntEvent', curmph.retrievedBounds);
                        evtSvc.addEvent('client-MapClickEvent', curmph.retrievedClick);

                        openNewDisplay = function (channel, userName) {
                            url = "?id=" + newSelectedWebMapId + curmph.getGlobalsForUrl() +
                                "&channel=" + channel + "&userName=" + userName +
                                "&maphost=ArcGIS" + "&referrerId=" + mlconfig.getUserId();
                            if (referringMph) {
                                url = "?id=" + newSelectedWebMapId + referringMph.getGlobalsForUrl() +
                                    "&channel=" + channel + "&userName=" + userName +
                                    "&maphost=ArcGIS" + "&referrerId=" + mlconfig.getUserId();
                            }

                            console.log("open new ArcGIS window with URI " + url);
                            console.log("using channel " + channel + "with userName " + userName);
                            mlconfig.setUrl(url);
                            mlconfig.setUserName(userName);
                            if (displayDestination === 'New Pop-up Window') {
                                baseUrl = mlconfig.getbaseurl();
                                window.open(baseUrl + "/arcgis/" + url, newSelectedWebMapId, mlconfig.getSmallFormDimensions());
                            } else {
                                baseUrl = mlconfig.getbaseurl();
                                window.open(baseUrl + "arcgis/" + url, '_blank');
                                window.focus();
                            }
                        };

                        if (mlconfig.isNameChannelAccepted() === false) {
                            PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                                mlconfig.getUserName(), openNewDisplay,
                                    {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        } else {
                            openNewDisplay(mlconfig.masherChannel(false), mlconfig.getUserName());
                        }
                    },

                    initialize = function (newSelectedWebMapId, destDetails, selectedMapTitle, referringMph) {
                        var curmph = MapHosterArcGIS,
                            displayDestination = destDetails.dstSel,
                            $inj,
                            evtSvc,
                            CurrentMapTypeService;
                        /*
                        This branch should only be encountered after a DestinationSelectorEvent in the AGO group/map search process.
                        The user desires to open a new popup or tab related to the current map view, without yet publishing the new map environment.
                         */
                        if (displayDestination === 'New Pop-up Window' || displayDestination === 'New Tab') {
                            prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
                        } else {
                            /*
                            This branch handles a new ArcGIS Online webmap presentation from either selecting the ArcGIS tab in the master
                            site or opening the webmap from a url sent through a publish event.
                             */
                            $inj = mlconfig.getInjector();
                            evtSvc = $inj.get('PusherEventHandlerService');
                            CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                            CurrentMapTypeService.setCurrentMapType('arcgis');
                            evtSvc.addEvent('client-MapXtntEvent', curmph.retrievedBounds);
                            evtSvc.addEvent('client-MapClickEvent',  curmph.retrievedClick);

                            initializePostProc(newSelectedWebMapId);
                        }
                    },
                    initializePreProc = function () {

                        console.log('initializePreProc entered');
                        // var urlparams=dojo.queryToObject(window.location.search);
                        // console.debug(urlparams);
                        // var idWebMap=urlparams['?id'];
                        var idWebMap = mlconfig.webmapId(true),
                            llon,
                            llat;

                        console.debug(idWebMap);
                        // initUI();
                        if (!idWebMap) {
                            console.log("no idWebMap");
                            selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 "; //"e68ab88371e145198215a792c2d3c794";
                            mlconfig.setWebmapId(selectedWebMapId);
                            console.log("use " + selectedWebMapId);
                            // pointWebMap = [-87.7, lat=41.8];
                            pointWebMap = [-87.620692, 41.888941];
                            zoomWebMap = 15;
                            // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
                            initialize(selectedWebMapId, {dstSel : 'no destination selection probably Same Window'});
                        } else {
                            console.log("found idWebMap");
                            console.log("use " + idWebMap);
                            zoomWebMap = mlconfig.zoom();
                            llon = mlconfig.lon();
                            llat = mlconfig.lat();
                            pointWebMap = [llon, llat];
                            initialize(idWebMap, {dstSel : 'no destination selection probably Same Window'});
                        }
                    };


                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: initializePreProc,
                    init: init
                };
            };

        return {
            StartupArcGIS: StartupArcGIS
        };
    });
}());
