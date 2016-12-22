/*global require, define, google, console, document, dojo, esri, alert, setTimeout, window, WebMap, all */
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupArcGIS setup');

    // require(['libs/MapHosterArcGIS', 'libs/utils', 'esri',
    // // 'https://js.arcgis.com/4.1/dojo/domReady!', 'https://js.arcgis.com/4.1/esri/WebMap', 'https://js.arcgis.com/4.1/esri/views/MapView']);
    // 'esri/WebMap', 'esri/views/MapView', 'dojo/domReady!'], //);

    require([
        'libs/MapHosterArcGIS',
        'libs/MLConfig',
        'libs/utils',
        'esri',
        'esri/WebMap',
        'esri/views/MapView',
        'dojo/domReady',
        'dojo/promise/all'
    ],
    function (MapHosterArcGIS, MLConfig, utils, esri, WebMap, MapView, domReady, all) {
        console.log('StartupArcGIS define');
        var
            StartupArcGIS = function (mapNo, mlconfig) {
                console.log("StartupArcGIS ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.aMap = null;
                this.mlconfig = mlconfig;
                console.log("Setting mapNumber to " + this.mapNumber);
                function showLoading() {
                    utils.showLoading();
                    self.aMap.disableMapNavigation();
                    self.aMap.hideZoomSlider();
                }

                function hideLoading(error) {
                    utils.hideLoading(error);
                    self.aMap.enableMapNavigation();
                    self.aMap.showZoomSlider();
                }
                function placeCustomControls() {
                    var $inj = self.mlconfig.getInjector(),
                        ctrlSvc = $inj.get('MapControllerService'),
                        mapCtrl = ctrlSvc.getController();
                    mapCtrl.placeCustomControls();
                }

                function setupQueryListener() {
                    var $inj = self.mlconfig.getInjector(),
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
                        return self.aMap;
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
                        console.debug(self.aMap);
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
                        if (self.mapHoster === null) {
                            console.log("self.Details.mph is null");
                            // alert("StartupArcGIS.initUI : selfDetails.mph == null");
                            // placeCustomControls();

                            self.mapHoster.config(self.aMap, zoomWebMap, pointWebMap);
                            placeCustomControls();
                            setupQueryListener();
                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("StartupArcGIS.initUI : selfDetails.mph as initially null and should now be set");
                            console.debug(MapHosterArcGIS);
                            console.debug(pusherChannel);
                            curmph = null;

                            $inj = self.mlconfig.getInjector();
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
                                self.mlconfig.getUserName(),
                                function (callbackChannel, userName) {
                                    console.log("callback - don't need to setPusherClient");
                                    console.log("It was a side effect of the createPusherClient:PusherClient process");
                                    self.mlconfig.setUserName(userName);
                                    // MapHosterArcGIS.prototype.setPusherClient(pusher, callbackChannel);
                                },
                                {'destination' : "destPlaceHolder", 'currentMapHolder' : curmph, 'newWindowId' : "windowIdPlaceholder"}
                            );
    */
                        } else {
                            console.log("self.mapHoster is something or other");
                            currentPusher = pusher;
                            currentChannel = channel;
                            self.mapHoster.config(self.aMap, zoomWebMap, pointWebMap);

                            // mph = new MapHosterArcGIS(window.map, zoomWebMap, pointWebMap);
                            console.log("use current pusher - now setPusherClient");
                            self.mapHoster.setPusherClient(currentPusher, currentChannel);
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

                        console.log('StartupArcGIS ready to instantiate Map Hoster with map no. ' + self.mapNumber);                        // return self.mapHoster;
                        esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
                        esri.config.defaults.io.proxyUrl = "/arcgisserver/apis/javascript/proxy/proxy.ashx";

                        //create the map using the web map id specified using configOptions or via the url parameter
                        // var cpn = new dijit.layout.ContentPane({}, "map_canvas").startup();

                        // dijit.byId("map_canvas").addChild(cpn).placeAt("map_canvas").startup();

                        self.aMap = new WebMap({portalItem : {id: configOptions.webmap}});
                        self.aMap.load()
                            .then(function () {
                              // load the basemap to get its layers created
                                return self.aMap.basemap.load();
                            })
                            .then(function () {

                                if (previousSelectedWebMapId !== selectedWebMapId) {
                                    previousSelectedWebMapId = selectedWebMapId;
                                    //dojo.destroy(map.container);
                                }
                                self.mapHoster = new MapHosterArcGIS.MapHosterArcGIS(self.aMap, self.mapNumber, self.mlconfig);
                                initUI();

                                // grab all the layers and load them
                                var allLayers = self.aMap.allLayers,
                                    promises = allLayers.map(function (layer) {
                                        return layer.load();
                                    });
                                return all(promises.toArray());
                            })
                            .then(function (layers) {
                                // each layer load promise resolves with the layer
                                console.log("all " + layers.length + " layers loaded");
                            })
                            .otherwise(function (error) {
                                console.error(error);
                            });
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

                        $inj = self.mlconfig.getInjector();
                        mapTypeSvc = $inj.get('CurrentMapTypeService');
                        curmph = mapTypeSvc.getSelectedMapType();

                        evtSvc = $inj.get('PusherEventHandlerService');
                        evtSvc.addEvent('client-MapXtntEvent', curmph.retrievedBounds);
                        evtSvc.addEvent('client-MapClickEvent', curmph.retrievedClick);

                        openNewDisplay = function (channel, userName) {
                            url = "?id=" + newSelectedWebMapId + curmph.getGlobalsForUrl() +
                                "&channel=" + channel + "&userName=" + userName +
                                "&maphost=ArcGIS" + "&referrerId=" + self.mlconfig.getUserId();
                            if (referringMph) {
                                url = "?id=" + newSelectedWebMapId + referringMph.getGlobalsForUrl() +
                                    "&channel=" + channel + "&userName=" + userName +
                                    "&maphost=ArcGIS" + "&referrerId=" + self.mlconfig.getUserId();
                            }

                            console.log("open new ArcGIS window with URI " + url);
                            console.log("using channel " + channel + "with userName " + userName);
                            self.mlconfig.setUrl(url);
                            self.mlconfig.setUserName(userName);
                            if (displayDestination === 'New Pop-up Window') {
                                baseUrl = self.mlconfig.getbaseurl();
                                window.open(baseUrl + "/arcgis/" + url, newSelectedWebMapId, self.mlconfig.getSmallFormDimensions());
                            } else {
                                baseUrl = self.mlconfig.getbaseurl();
                                window.open(baseUrl + "arcgis/" + url, '_blank');
                                window.focus();
                            }
                        };

                        if (self.mlconfig.isNameChannelAccepted() === false) {
                            PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                                self.mlconfig.getUserName(), openNewDisplay,
                                    {'destination' : displayDestination, 'currentMapHolder' : curmph, 'newWindowId' : newSelectedWebMapId});
                        } else {
                            openNewDisplay(self.mlconfig.masherChannel(false), self.mlconfig.getUserName());
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
                            $inj = self.mlconfig.getInjector();
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
                        var idWebMap = self.mlconfig.webmapId(true),
                            llon,
                            llat;

                        console.debug(idWebMap);
                        // initUI();
                        if (!idWebMap) {
                            console.log("no idWebMap");
                            selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 "; //"e68ab88371e145198215a792c2d3c794";
                            self.mlconfig.setWebmapId(selectedWebMapId);
                            console.log("use " + selectedWebMapId);
                            // pointWebMap = [-87.7, lat=41.8];
                            pointWebMap = [-87.620692, 41.888941];
                            zoomWebMap = 15;
                            // initialize(selectedWebMapId, '', '');   original from mlhybrid requires space after comma
                            initialize(selectedWebMapId, {dstSel : 'no destination selection probably Same Window'});
                        } else {
                            console.log("found idWebMap");
                            console.log("use " + idWebMap);
                            zoomWebMap = self.mlconfig.zoom();
                            llon = self.mlconfig.lon();
                            llat = self.mlconfig.lat();
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
