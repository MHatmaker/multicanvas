/*global require, define, google, console, document, dojo, esri, alert */
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('StartupArcGIS setup');

    require(['lib/MapHosterArcGIS', 'lib/utils']);

    dojo.require("esri.map");
    dojo.require("esri.tasks.geometry");
    dojo.require("esri.tasks.locator");
    dojo.require("esri/geometry/webMercatorUtils");
    dojo.require("esri.IdentityManager");
    dojo.require("esri.dijit.Scalebar");
    dojo.require("esri.arcgis.utils");
    dojo.require("dojo.parser");

    define([
        'libs/MapHosterArcGIS',
        'libs/MLConfig'
    ], function (MapHosterArcGIS, MLConfig) {
        console.log('StartupArcGIS define');
        var
            StartupArcGIS = function (mapNo) {
                console.log("StartupArcGIS ctor");
                this.mapNumber = mapNo;
                this.mapHoster = null;
                this.gMap = null;
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
                        var
                            configOptions,
                            selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 ", // Requires a space after map ID
                            $inj,
                            evtSvc,
                            centerLatLng,
                            initZoom,
                            mapOptions = {},
                            qlat,
                            qlon,
                            bnds,
                            zoomStr;

                        console.log("StartupArcGIS configure with map no. " + self.mapNumber);
                        // var centerLatLng = new google.maps.LatLng(41.8, -87.7);
                        centerLatLng = new google.maps.LatLng(mapOpts.center.lat, mapOpts.center.lng);
                        initZoom = 15;

                        if (mapOpts) {
                            centerLatLng = mapOpts.center;
                            initZoom = mapOpts.zoom;
                        }

                        mapOptions = {
                            center: centerLatLng, //new google.maps.LatLng(41.8, -87.7),
                            // center: new google.maps.LatLng(51.50, -0.09),
                            zoom: initZoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        self.gMap = new google.maps.Map(document.getElementById("map" + self.mapNumber), mapOptions);
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
                                deferred.cancel();
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
                    initialize = function (newSelectedWebMapId, destDetails, selectedMapTitle, referringMph) {
                        var curmph = MapHosterArcGIS,
                            displayDestination = destDetails.dstSel,
                            $inj,
                            evtSvc,
                            CurrentMapTypeService;
                        /*
                        This branch should only be encountered after a DestinationSelectorEvent in the AGO group/map search process.  The user desires to open a new popup or tab related to the current map view, without yet publishing the new map environment.
                         */
                        if (displayDestination === 'New Pop-up Window' || displayDestination === 'New Tab') {
                            prepareWindow(newSelectedWebMapId, referringMph, displayDestination);
                        } else {
                            /*
                            This branch handles a new ArcGIS Online webmap presentation from either selecting the ArcGIS tab in the master
                            site or opening the webmap from a url sent through a publish event.
                             */
                            $inj = MLConfig.getInjector();
                            evtSvc = $inj.get('PusherEventHandlerService');
                            CurrentMapTypeService = $inj.get('CurrentMapTypeService');
                            CurrentMapTypeService.setCurrentMapType('arcgis');
                            evtSvc.addEvent('client-MapXtntEvent', curmph.retrievedBounds);
                            evtSvc.addEvent('client-MapClickEvent',  curmph.retrievedClick);

                            initializePostProc(newSelectedWebMapId);
                        }
                    }
                    initializePreProc = function () {
                        var selectedWebMapId = "a4bb8a91ecfb4131aa544eddfbc2f1d0 ", //"e68ab88371e145198215a792c2d3c794";
                        pointWebMap = [-87.620692, 41.888941],
                        zoomWebMap = 15;
                        // MLConfig.setWebmapId(selectedWebMapId);
                        console.log("use " + selectedWebMapId);
                        // pointWebMap = [-87.7, lat=41.8];
                        initialize(selectedWebMapId, '', '');
                    };


                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    getMapHosterInstance: getMapHosterInstance,
                    configure: intitializePreProc,
                    init: init
                };
            };

        return {
            StartupArcGIS: StartupArcGIS
        };
    });
}());
