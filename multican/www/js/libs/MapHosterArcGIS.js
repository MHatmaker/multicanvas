/*global require, define, google, console, document, angular*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('MapHosterArcGIS setup');

    define([
        'controllers/PositionViewCtrl',
        'libs/utils',
        'libs/MLConfig',
        'libs/PusherConfig',
        'esri/geometry/Point'
    ], function (PositionViewCtrl, utils, MLConfig, PusherConfig, GeometryPoint) {
        console.log('MapHosterArcGIS define');
        var
            MapHosterArcGIS = function (aMap, mapNo, mlconfig) {
                console.log("MapHosterArcGIS ctor");
                this.mapNumber = mapNo;
                this.aMap = aMap;
                this.mlconfig = mlconfig;
                console.log("Setting mapNumber to " + this.mapNumber);

                var self = this,
                    scale2Level = [],
                    zoomLevels = 0,
                    zmG,
                    cntrxG,
                    cntryG,
                    bounds,
                    userZoom = true,
                    selfPusherDetails = {
                        channel : null,
                        pusher : null
                    },

                    getMap = function () {
                        return self.aMap;
                    },

                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    // getMapHosterInstance = function (ndx) {
                    //     return self.aMap;
                    // },

                    configure = function (newMapId, mapOpts) {
                        // var $inj,
                        //     evtSvc,
                        //     centerLatLng,
                        //     initZoom,
                        //     mapOptions = {},
                        //     qlat,
                        //     qlon,
                        //     bnds,
                        //     zoomStr;

                        console.log("MapHosterArcGIS configure with map no. " + self.mapNumber);
                    },
                    setUserName = function(name) {
                        self.mlconfig.setUserName(name);
                    },
                    getEventDictionary = function() {
                        var $inj = self.mlconfig.getInjector(),
                            evtSvc = $inj.get('PusherEventHandlerService'),
                            eventDct = evtSvc.getEventDct();
                        return eventDct;
                    },
                    setPusherClient = function (pusher, channel) {
                        console.log("MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        var $inj = self.mlconfig.getInjector(),
                            evtSvc = $inj.get('PusherEventHandlerService'),
                            evtDct = evtSvc.getEventDct(),
                            key;

                        if (selfPusherDetails.pusher === null) {
                            selfPusherDetails.pusher = pusher;
                            selfPusherDetails.channel = channel;
                            PusherConfig.getInstance().setChannel(channel);

                            $inj = self.mlconfig.getInjector();
                            evtSvc = $inj.get('PusherEventHandlerService');
                            evtDct = evtSvc.getEventDct();
                            for (key in evtDct) {
                                if (evtDct.hasOwnProperty(key)) {
                                    pusher.subscribe(key, evtDct[key]);
                                }
                            }

                            // pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
                            // pusher.subscribe( 'client-MapClickEvent', retrievedClick);
                            // pusher.subscribe( 'client-NewMapPosition', retrievedNewPosition);
                            console.log("reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        }
                    },

                    retrievedClick = function (clickPt) {
                        console.log("Back in retrievedClick");
                        // var latlng = L.latLng(clickPt.y, clickPt.x, clickPt.y);
                        console.log("You clicked the map at " + clickPt.x + ", " + clickPt.y);
                        // alert("You clicked the map at " + clickPt.x + ", " + clickPt.y);
                        console.debug(clickPt);
                        var mpDiv = document.getElementById("map_canvas"),
                            mpDivNG = angular.element(mpDiv),
                            wdt = mpDivNG[0].clientWidth,
                            hgt = mpDivNG[0].clientHeight,
                            mppt = new GeometryPoint(clickPt.x, clickPt.y),
                            screenGeo = new esri.geometry.toScreenGeometry(self.aMap.geographicExtent, wdt, hgt, mppt),
                            fixedLL,
                            content,
                            $inj,
                            linkrSvc;

                        console.log("screenGeo");
                        console.debug(screenGeo);
                        $inj = MLConfig.getInjector();
                        linkrSvc = $inj.get('LinkrService');
                        linkrSvc.hideLinkr();

                        //      screengraphic = new esri.geometry.toScreenGeometry(mphmap.extent,800,600,userdrawlayer.graphics[0].geometry);

                        if (clickPt.referrerId !== MLConfig.getUserId()) {
                            fixedLL = utils.toFixed(clickPt.x, clickPt.y, 6);
                            content = "Map click at " + fixedLL.lat + ", " + fixedLL.lon;
                            if (clickPt.title) {
                                content += '<br>' + clickPt.title;
                            }
                            if (clickPt.address) {
                                content += '<br>' + clickPt.address;
                            }
                            self.aMap.infoWindow.setTitle("Received from user " + clickPt.referrerName + ", " + clickPt.referrerId);
                            self.aMap.infoWindow.setContent(content);
                        }

                        self.aMap.infoWindow.show(mppt, self.aMap.getInfoWindowAnchor(screenGeo));
                        // popup
                            // .setLatLng(latlng)
                            // .setContent("You clicked the map at " + latlng.toString())
                            // .openOn(mphmap);
                    },

                    retrievedBounds = function (xj) {
                        console.log("Back in retrievedBounds");
                        var zm = xj.zoom,
                            cmp = compareExtents("retrievedBounds",
                                {
                                    'zoom' : xj.zoom,
                                    'lon' : xj.lon,
                                    'lat' : xj.lat
                                }),
                            view = xj.lon + ", " + xj.lat + " : " + zm + " " + scale2Level[zm].scale,
                            tmpLon,
                            tmpLat,
                            tmpZm,
                            cntr;

                        if (document.getElementById("mppos") !== null) {
                            document.getElementById("mppos").value = view;
                        }
                        if (cmp === false) {
                            tmpLon = cntrxG;
                            tmpLat = cntryG;
                            tmpZm = zmG;

                            updateGlobals("retrievedBounds with cmp false", xj.lon, xj.lat, xj.zoom);
                            // userZoom = false;
                            console.log("retrievedBounds centerAndZoom at zm = " + zm);
                            cntr = new GeometryPoint(xj.lon, xj.lat, new esri.SpatialReference({wkid: 4326}));

                            userZoom = false;
                            if (xj.action === 'pan') {
                                if (tmpZm !== zm) {
                                    self.aMap.centerAndZoom(cntr, zm);
                                } else {
                                    self.aMap.centerAt(cntr);
                                }
                            } else {
                                if (tmpLon !== xj.lon || tmpLat !== xj.lat) {
                                    // var tmpCenter = new GeometryPoint(tmpLon, tmpLat, new esri.SpatialReference({wkid: 4326}));
                                    self.aMap.centerAndZoom(cntr, zm);
                                } else {
                                    self.aMap.setZoom(zm);
                                }
                            }
                            userZoom = true;
                        }
                    },

                    retrievedNewPosition = function (pos) {
                        console.log("Back in retrievedNewPosition");
                        console.log(pos);
                        String.format('open map using framework {0} at x {1}, y {2}, zoom (3)',
                            pos.maphost, pos.lon, pos.lat, pos.zoom);
                    },


                    init = function () {
                        console.log('MapHosterArcGIS init');
                        return MapHosterArcGIS;
                    };
                function updateGlobals(msg, cntrx, cntry, zm) {
                    console.log("updateGlobals ");
                    zmG = zm;
                    cntrxG = cntrx;
                    cntryG = cntry;
                    if (self.aMap !== null) {
                        bounds = self.aMap.geographicExtent;
                        MLConfig.setBounds({'llx' : bounds.xmin, 'lly' : bounds.ymin, 'urx' : bounds.xmax, 'ury' : bounds.ymax});
                    }
                    console.log("Updated Globals " + msg + " " + cntrxG + ", " + cntryG + " : " + zmG);
                    PositionViewCtrl.update('zm', {
                        'zm' : zmG,
                        'scl' : scale2Level.length > 0 ? scale2Level[zmG].scale : 3,
                        'cntrlng' : cntrxG,
                        'cntrlat': cntryG,
                        'evlng' : cntrxG,
                        'evlat' : cntryG
                    });
                    MLConfig.setPosition({'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG});
                }

                function showGlobals(cntxt) {
                    console.log(cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
                }

                function compareExtents(msg, xtnt) {
                    var cmp = xtnt.zoom === zmG,
                        wdth = Math.abs(bounds.xmax - bounds.xmin),
                        hgt = Math.abs(bounds.ymax - bounds.ymin),
                        lonDif = Math.abs((xtnt.lon - cntrxG) / wdth),
                        latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                    // cmp = ((cmp == true) && (xtnt.lon == cntrxG) && (xtnt.lat == cntryG));
                    cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                    console.log("compareExtents " + msg + " " + cmp);
                    return cmp;
                }
                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    // getMapHosterInstance: getMapHosterInstance,
                    config: configure,
                    init: init,
                    setPusherClient: setPusherClient,
                    retrievedBounds: retrievedBounds,
                    retrievedClick: retrievedClick,
                    retrievedNewPosition: retrievedNewPosition,
                    setUserName: setUserName,
                    getEventDictionary: getEventDictionary
                };
            };

        return {
            MapHosterArcGIS: MapHosterArcGIS
        };
    });
// }());
}).call(this);
