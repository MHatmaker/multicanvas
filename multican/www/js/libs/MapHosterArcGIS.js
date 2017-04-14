/*global require, define, google, console, document, angular, esri, dojo, proj4, alert, window*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log('MapHosterArcGIS setup');
    require(['esri.tasks.Locator']);

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
                    mphmap = null,
                    mapReady = true,
                    zoomLevels = 0,
                    zmG,
                    cntrxG,
                    cntryG,
                    bounds,
                    userZoom = true,
                    selectedMarkerId = 101,
                    initialActionListHtml = '',
                    geoLocator = null,
                    screenPt = null,
                    fixedLLG = null,
                    btnShare,
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

                    updateGlobals = function (msg, cntrx, cntry, zm) {
                        console.log("updateGlobals ");
                        zmG = zm;
                        cntrxG = cntrx;
                        cntryG = cntry;
                        if (self.aMap !== null) {
                            bounds = self.aMap.geographicExtent;
                            self.mlconfig.setBounds({'llx' : bounds.xmin, 'lly' : bounds.ymin, 'urx' : bounds.xmax, 'ury' : bounds.ymax});
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
                        self.mlconfig.setPosition({'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG});
                    },

                    showGlobals = function (cntxt) {
                        console.log(cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
                    },

                    initMap = function (value, precision) {
                        /*jslint nomen: true */  // for dangling _
                        var tileInfo = mphmap.__tileInfo,
                            lods = tileInfo.lods,
                            sc2lv;
                        zoomLevels = lods.length;
                        scale2Level = [];
                        sc2lv = scale2Level;
                        dojo.forEach(lods, function (item, i) {
                            var obj = {"scale" : item.scale, "resolution" : item.resolution, "level" : item.level};
                            sc2lv.push(obj);
                            // console.log("scale " + obj.scale + " level " + obj.level + " resolution " + obj.resolution);
                        });
                        console.log("zoom levels : " + zoomLevels);
                    },

                    extractBounds = function (zm, cntr, action) {
                        var source = proj4.Proj('GOOGLE'),
                            dest = proj4.Proj('WGS84'),
                            p = new proj4.toPoint([cntr.x, cntr.y]),
                            cntrpt,
                            fixedLL,
                            xtntDict = {};

                        console.log("proj4.transform " + p.x + ", " + p.y);
                        try {
                            proj4.transform(source, dest, p);
                        } catch (err) {
                            alert("proj4.transform threw up");
                        }
                        console.log("ready to create ESRI pt with " + p.x + ", " + p.y);

                        cntrpt = new esri.geometry.Point(p.x, p.y, new esri.SpatialReference({wkid: 4326}));
                        console.log("cntr " + cntr.x + ", " + cntr.y);
                        console.log("cntrpt " + cntrpt.x + ", " + cntrpt.y);
                        fixedLL = utils.toFixed(cntrpt.x, cntrpt.y, 3);
                        xtntDict = {
                            'src' : 'arcgis',
                            'zoom' : zm,
                            'lon' : fixedLL.lon,
                            'lat' : fixedLL.lat,
                            'scale': scale2Level[zm].scale,
                            'action': action
                        };
                        return xtntDict;
                    },

                    compareExtents = function (msg, xtnt) {
                        var cmp = xtnt.zoom === zmG,
                            wdth = Math.abs(bounds.xmax - bounds.xmin),
                            hgt = Math.abs(bounds.ymax - bounds.ymin),
                            lonDif = Math.abs((xtnt.lon - cntrxG) / wdth),
                            latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                        // cmp = ((cmp == true) && (xtnt.lon == cntrxG) && (xtnt.lat == cntryG));
                        cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                        console.log("compareExtents " + msg + " " + cmp);
                        return cmp;
                    },

                    setBounds = function (xtExt) {
                        console.log("MapHosterArcGIS setBounds with selfPusherDetails.pusher " + selfPusherDetails.pusher);
                        var xtntJsonStr,
                            cmp;
                        if (mapReady === true && selfPusherDetails.pusher) { // && self.pusher.ready == true) {
                            // runs this code after you finishing the zoom
                            console.log("setBounds ready to process json xtExt");
                            xtntJsonStr = JSON.stringify(xtExt);
                            console.log("extracted bounds " + xtntJsonStr);
                            cmp = compareExtents("setBounds", xtExt);
                            if (cmp === false) {
                                console.log("MapHoster setBounds pusher send ");

                                if (selfPusherDetails.pusher && selfPusherDetails.channel) {
                                    selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapXtntEvent', xtExt);
                                }
                                updateGlobals("setBounds with cmp false", xtExt.lon, xtExt.lat, xtExt.zoom);
                                //console.debug(sendRet);
                            }
                        }
                    },

                    setUserName = function (name) {
                        self.mlconfig.setUserName(name);
                    },
                    getEventDictionary = function () {
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
                        $inj = self.mlconfig.getInjector();
                        linkrSvc = $inj.get('LinkrService');
                        linkrSvc.hideLinkr();

                        //      screengraphic = new esri.geometry.toScreenGeometry(mphmap.extent,800,600,userdrawlayer.graphics[0].geometry);

                        if (clickPt.referrerId !== self.mlconfig.getUserId()) {
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

                    onMapClick = function (e) {
                        var mapPt = {x : e.mapPoint.x, y : e.mapPoint.y},
                            source = new proj4.Proj('GOOGLE'),
                            dest = new proj4.Proj('WGS84'),
                            p,
                            cntrpt;
                        screenPt = e.screenPoint;
                        console.log("e.screenPoint");
                        console.debug(e.screenPoint);
                        p = new proj4.toPoint([e.mapPoint.x, e.mapPoint.y]);
                        proj4.transform(source, dest, p);
                        cntrpt = new esri.geometry.Point(p.x, p.y, new esri.SpatialReference({wkid: 4326}));
                        console.log("clicked Pt " + mapPt.x + ", " + mapPt.y);
                        console.log("converted Pt " + cntrpt.x + ", " + cntrpt.y);
                        fixedLLG = utils.toFixed(cntrpt.x, cntrpt.y, 3);
                        geoLocator.locationToAddress(esri.geometry.webMercatorToGeographic(e.mapPoint), 100);
                     /*
                        // mphmap.infoWindow.setTitle("Coordinates");
                        // mphmap.infoWindow.setContent("lat/lon : " + fixedLL.lat + ", " + fixedLL.lon);
                        mphmap.infoWindow.show(e.screenPoint,mphmap.getInfoWindowAnchor(e.screenPoint));

                        if (selfPusherDetails.pusher)
                        {
                            var latlng = {"x" : fixedLL.lon, "y" : fixedLL.lat,  "z" : "0"};
                            console.log("Push coordinates");
                            console.debug(latlng);
                            selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapClickEvent', latlng);
                        }
                         */
                    },

                    showClickResult = function (content) {
                        var contextContent = content,
                            actionList = document.getElementsByClassName('actionList')[0],
                            contentNode = document.getElementsByClassName('contentPane')[0],
                            shareBtnId = 'shareSomethingId' + selectedMarkerId,
                            addedShareBtn = '<button class="btn-primary" id="' + shareBtnId + '" >Share</button>',
                            showSomething = null,
                            addedContent,
                            addedContentNode;

                        console.debug(actionList);
                        if (selectedMarkerId === 101) {
                            initialActionListHtml = actionList.innerHTML;
                        }
                        selectedMarkerId += 1;
                        actionList.innerHTML = initialActionListHtml + addedShareBtn;

                        if (content === null) {
                            addedContent = "Share lat/lon : " + fixedLLG.lat + ", " + fixedLLG.lon;
                            mphmap.infoWindow.setTitle("Ready to Push Click");
                            mphmap.infoWindow.setContent("lat/lon : " + fixedLLG.lat + ", " + fixedLLG.lon);
                        } else {
                            addedContent = 'Share address : ' + content;
                            // if (actionList.className === 'actionList hidden') {
                            //     addedContent = content + '<br>' + addedShareBtn;
                            // }
                            addedContentNode = document.createTextNode(addedContent);
                            contentNode.appendChild(addedContentNode);
                            // mphmap.infoWindow.setContent(content);
                        }

                        showSomething = function () {
                            var referrerId,
                                referrerName,
                                pushLL = {};

                            if (selfPusherDetails.pusher) {
                                referrerId = self.mlconfig.getUserId();
                                referrerName = self.mlconfig.getUserName();
                                pushLL = {
                                    "x" : fixedLLG.lon,
                                    "y" : fixedLLG.lat,
                                    "z" : "0",
                                    "referrerId" : referrerId,
                                    "referrerName" : referrerName,
                                    'address' : contextContent
                                };
                                console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLLG.lat + ", " + fixedLLG.lon);
                                selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapClickEvent', pushLL);
                            }
                        };

                        mphmap.infoWindow.show(screenPt, mphmap.getInfoWindowAnchor(screenPt));

                        btnShare = document.getElementById(shareBtnId);
                        btnShare.onclick = function () {
                            showSomething();
                        };
                          /*
                        if (selfPusherDetails.pusher)
                        {
                            var referrerId = self.mlconfig`.getUserId();
                                 referrerName = self.mlconfig`.getUserName();
                                 pushLL = {"x" : fixedLLG.lon, "y" : fixedLLG.lat, "z" : "0",
                                    "referrerId" : referrerId, "referrerName" : referrerName,
                                        'address' : contextContent };
                                console.log("You, " + referrerName + ", " + referrerId + ", clicked the map at " + fixedLLG.lat + ", " + fixedLLG.lon);
                            selfPusherDetails.pusher.channel(selfPusherDetails.channel).trigger('client-MapClickEvent', pushLL);
                        }
                        */
                    },

                    configureMap = function (xtntMap, zoomWebMap, pointWebMap) { // newMapId, mapOpts
                        console.log("configureMap");
                        var qlat, qlon, qzoom, startCenter, cntr, xtnt, address,
                            mpWrap = null,
                            mpCan = null,
                            mpCanRoot = null;
                            // currentVerbVis = false;; //, location;
                        mphmap = xtntMap;
                        mapReady = false;
                        // alert("before first update globals");
                        if (zoomWebMap !== null) {
                            updateGlobals("init with attributes in args", pointWebMap[0], pointWebMap[1], zoomWebMap);
                        } else {

                            qlat = self.mlconfig.lat();
                            qlon = self.mlconfig.lon();
                            qzoom = self.mlconfig.zoom();

                            if (qlat !== '') {
                                updateGlobals("init with qlon, qlat", qlon, qlat, qzoom);
                            } else {
                                updateGlobals("init with hard-coded values", -87.620692, 41.888941, 13);
                            }

                            // updateGlobals("init standard", -87.7, 41.8, 13);
                        }
                        showGlobals("Prior to new Map");
                        // alert("showed first globals");
                        startCenter = new esri.geometry.Point(cntrxG, cntryG, new esri.SpatialReference({wkid: 4326}));

                        updateGlobals("using startCenter", startCenter.x, startCenter.y, zmG, 0.0);
                        showGlobals("Prior to startup centerAndZoom");
                        mphmap.centerAndZoom(startCenter, zmG);
                        showGlobals("After centerAndZoom");

                        initMap("mapDiv_layer0");
                        geoLocator = new esri.tasks.Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

                        // addInitialSymbols();
                        bounds = mphmap.geographicExtent;
                        userZoom = true;

                        dojo.connect(mphmap, "onZoomStart", function (extent, zoomFactor, anchor, level) {
                            zmG = level;
                        });
                        dojo.connect(mphmap, "onZoomEnd", function (extent, zoomFactor, anchor, level) {
                            console.debug("onZoomEnd with userZoom = " + userZoom);
                            if (userZoom === true) {
                                cntr = extent.getCenter();
                                xtnt = extractBounds(mphmap.getLevel(), cntr, 'zoom');
                                setBounds(xtnt);
                            }
                            // userZoom = true;
                        });
                        dojo.connect(mphmap, "onPanStart", function (extent, startPoint) {
                            console.log("onPanStart");
                        });
                        dojo.connect(mphmap, "onPanEnd", function (extent, endPoint) {
                            if (userZoom === true) {
                                cntr = extent.getCenter();
                                xtnt = extractBounds(mphmap.getLevel(), cntr, 'pan');
                                // var xtnt = extractBounds(zmG, endPoint, 'pan');
                                setBounds(xtnt);
                            }
                        });
                        dojo.connect(mphmap, "onMouseMove", function (e) {
                            var ltln = esri.geometry.webMercatorToGeographic(e.mapPoint),
                                fixedLL = utils.toFixed(ltln.x, ltln.y, 4),
                                evlng = fixedLL.lon,
                                evlat = fixedLL.lat,
                                zm = mphmap.getLevel(),
                                xtntLoc = mphmap.extent,
                                cntrLoc = esri.geometry.webMercatorToGeographic(xtntLoc.getCenter()),
                                fixedCntrLL = utils.toFixed(cntrLoc.x, cntrLoc.y, 4),
                                cntrlng = fixedCntrLL.lon,
                                cntrlat = fixedCntrLL.lat;
                            //     view = "Zoom : " + zm + " Center : " + cntrlng + ", " + cntrlat + " Current  : " + evlng + ", " + evlat;      // + selectedWebMapId;
                            // document.getElementById("mppos").value = view;
                            PositionViewCtrl.update('coords', {
                                'zm' : zm,
                                'scl' : scale2Level[zm].scale,
                                'cntrlng' : cntrlng,
                                'cntrlat': cntrlat,
                                'evlng' : evlng,
                                'evlat' : evlat
                            });
                        });
                        mphmap.on("click", onMapClick);
                        geoLocator.on("location-to-address-complete", function (evt) {
                            var location;
                            if (evt.address.address) {
                                address = evt.address.address;
                                location = esri.geometry.geographicToWebMercator(evt.address.location);
                                showClickResult(address.Address);
                                console.debug(location);
                            } else {
                                showClickResult(null);
                            }
                        });
                        window.addEventListener("resize", function () {
                            mphmap.resize();

                            mpCanRoot.style.width = "100%";
                            mpCanRoot.style.height = "100%";
                        });
                        mapReady = true;
                        userZoom = true;

                        mpWrap = document.getElementById("map_wrapper");
                        mpCan = document.getElementById("map_canvas");
                        mpCanRoot = document.getElementById("map_canvas_root");
                    },

                    retrievedBounds = function (xj) {
                        console.log("Back in retrievedBounds");
                        // function compareExtents(msg, xtnt) {
                        //     var cmp = xtnt.zoom === zmG,
                        //         wdth = Math.abs(bounds.xmax - bounds.xmin),
                        //         hgt = Math.abs(bounds.ymax - bounds.ymin),
                        //         lonDif = Math.abs((xtnt.lon - cntrxG) / wdth),
                        //         latDif =  Math.abs((xtnt.lat - cntryG) / hgt);
                        //     // cmp = ((cmp == true) && (xtnt.lon == cntrxG) && (xtnt.lat == cntryG));
                        //     cmp = ((cmp === true) && (lonDif < 0.0005) && (latDif < 0.0005));
                        //     console.log("compareExtents " + msg + " " + cmp);
                        //     return cmp;
                        // }
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

                    getGlobalsForUrl = function () {
                        console.log(" MapHosterArcGIS.prototype.getGlobalsForUrl");
                        console.log("&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG);
                        return "&lon=" + cntrxG + "&lat=" + cntryG + "&zoom=" + zmG;
                    },

                    getGlobalPositionComponents = function () {
                        return {"lon" : cntrxG, "lat" : cntryG, "zoom" : zmG};
                    },

                    getCenter = function () {
                        var pos = { 'lon' : cntrxG, 'lat' : cntryG, 'zoom' : zmG};
                        console.log("return accurate center from getCenter()");
                        console.debug(pos);
                        return pos;
                    },

                    init = function () {
                        console.log('MapHosterArcGIS init');
                        return {
                            getMap: getMap,
                            getMapNumber: getMapNumber,
                            // getMapHosterInstance: getMapHosterInstance,
                            config: configureMap,
                            init: init,
                            setPusherClient: setPusherClient,
                            retrievedBounds: retrievedBounds,
                            retrievedClick: retrievedClick,
                            retrievedNewPosition: retrievedNewPosition,
                            setUserName: setUserName,
                            getEventDictionary: getEventDictionary,
                            getGlobalsForUrl: getGlobalsForUrl,
                            getGlobalPositionComponents: getGlobalPositionComponents,
                            getCenter: getCenter
                        };
                    };

                // function showGlobals(cntxt) {
                //     console.log(cntxt + " Globals : lon " + cntrxG + " lat " + cntryG + " zoom " + zmG);
                // }

                return {
                    getMap: getMap,
                    getMapNumber: getMapNumber,
                    // getMapHosterInstance: getMapHosterInstance,
                    config: configureMap,
                    init: init,
                    setPusherClient: setPusherClient,
                    retrievedBounds: retrievedBounds,
                    retrievedClick: retrievedClick,
                    retrievedNewPosition: retrievedNewPosition,
                    setUserName: setUserName,
                    getEventDictionary: getEventDictionary,
                    getGlobalsForUrl: getGlobalsForUrl,
                    getGlobalPositionComponents: getGlobalPositionComponents,
                    getCenter: getCenter
                };
            };

        return {
            MapHosterArcGIS: MapHosterArcGIS
        };
    });
// }());
}).call(this);
