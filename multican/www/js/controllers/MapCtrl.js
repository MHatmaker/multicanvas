/*global define, require, console, google, document, window, navigator, alert, angular, plugin, Promise*/

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/
/*global $, jQuery, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'esri/map',
        'controllers/DestWndSetupCtrl',
        'libs/StartupGoogle',
        'libs/StartupArcGIS',
        'libs/StartupLeaflet',
        'libs/utils',
        'controllers/PusherSetupCtrl',
        'controllers/MapLinkrMgrCtrl',
        'controllers/WindowStarter',
        'controllers/CanvasHolderCtrl',
        'controllers/CarouselCtrl',
        'libs/MLConfig',
        'libs/PusherConfig'
    ], function (Map, DestWndSetupCtrl, StartupGoogle, StartupArcGIS, StartupLeaflet, libutils, PusherSetupCtrl,
            MapLinkrMgrCtrl, WindowStarterArg, CanvasHolderCtrlArg, CarouselCtrlArg, MLConfig, PusherConfig) {
        var selfMethods = {},
            selfVars = {},
            MapInstanceService,
            CurrentMapTypeService,
            SiteViewService,
            LinkrSvc,
            WindowStarter = WindowStarterArg,
            CanvasHolderCtrl = CanvasHolderCtrlArg,
            CarouselCtrl = CarouselCtrlArg,
            mlconfig,
            gmquery,
            currentMapType,
            curMapTypeInitialized = false,
            whichCanvas = 'map_canvas',
            searchBox = null,
            gmQSvc = null,
            modalInstance,
            mlmap,
            MapCtrl,
            infoWindow = null,
            tmpltName,
            utils = libutils,
            queryForNewDisplay = "",
            queryForSameDisplay = "",
            $scope,
            $compile,
            $routeParams,
            firstMap = true,
            commonInitialized = false,
            mapStartup;

        selfVars.searchInput = null;
        selfVars.placesFromSearch = null;

        function invalidateCurrentMapTypeConfigured() {
            curMapTypeInitialized = false;
        }
        selfMethods.invalidateCurrentMapTypeConfigured = invalidateCurrentMapTypeConfigured;

        function refreshLinker(mapNo) {
            var lnkrText = document.getElementById("idLinkerText" + mapNo),
                lnkrSymbol = document.getElementById("idLinkerSymbol" + mapNo),
                lnkrTxt,
                lnkrSmbl;
            if (lnkrSymbol && lnkrText) {
                try {
                    lnkrTxt =  MapLinkrMgrCtrl.getLinkrMgrData().ExpandPlug;
                    lnkrText.innerHTML = lnkrTxt;
                    console.log("refresh Linker Text with " + lnkrText.innerHTML);
                    lnkrSmbl = "../img/" + MapLinkrMgrCtrl.getLinkrMgrData().mapLinkrBtnImage + ".png";
                    lnkrSymbol.src = lnkrSmbl;
                    console.log("refresh Linker Symbol with " + lnkrSymbol.src);
                } catch (err) {
                    lnkrText.innerHTML = "Expand";
                    lnkrSmbl = "../img/Expand.png";
                }
            }
        }

        function refreshMinMax(mapNo) {
            var minMaxText = document.getElementById("idMinMaxText" + mapNo),
                minMaxSymbol = document.getElementById("idMinMaxSymbol" + mapNo);
            if (minMaxText && minMaxSymbol) {
                minMaxText.innerHTML = SiteViewService.getSiteExpansion();
                console.log("refresh MinMax Text with " + minMaxText.innerHTML);
                minMaxSymbol.src = "../img/" + SiteViewService.getMinMaxSymbol() + ".png";
                console.log("refresh MinMax Symbol with " + minMaxSymbol.src);
            }
        }

        function initializeCommon(scope, $routeParamsArg, compileArg, $uibModal, $uibModalStack, MapInstanceSvc, LinkrSvcArg,
                    CurrentMapTypeSvc, GoogleQueryService, SiteViewServiceArg, $state) {
            var outerMapNumber;
            console.log('initializeCommon and set $scope');

            $scope = scope;
            $compile = compileArg;
            $routeParams = $routeParamsArg;
            CurrentMapTypeService = CurrentMapTypeSvc;
            LinkrSvc = LinkrSvcArg;
            SiteViewService = SiteViewServiceArg;
                    // gmquery = mlconfig.query();
                // var mapNumber = MapInstanceService.getSlideCount(),
                //     mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                //     configMapNumber = mapConfig.getMapId();
                    // mapStartups = [];
                // console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
            MapInstanceService = MapInstanceSvc;
            outerMapNumber = MapInstanceService.getSlideCount();
            if (!MapInstanceService.hasConfigInstanceForMap(outerMapNumber)) {
                mlconfig = new MLConfig.MLConfig(outerMapNumber);
                MapInstanceService.setConfigInstanceForMap(outerMapNumber, mlconfig); //outerMapNumber, angular.copy(mlconfig));
            }
            gmquery = mlconfig.query();

            whichCanvas = CurrentMapTypeService.getMapTypeKey() === 'arcgis' ? 'map' + outerMapNumber + '_root' : 'map' + outerMapNumber;
            // CurrentMapTypeService.addScope($scope);
            // $scope.$on('ForceMapSystemEvent', function (evt, args) {
            //     $scope.currentMapSystem = args.whichsystem;
            // });
            $scope.currentMapSystem = CurrentMapTypeService.getCurrentMapConfiguration();

            $scope.$on('SwitchedMapSystemEvent', function (evt, args) {
                console.log("In MapCtrl ... SwitchedMapSystemEvent");

                $scope.currentMapSystem = args.whichsystem;
                whichCanvas = $scope.currentMapSystem.maptype === 'arcgis' ? 'map' + outerMapNumber + '_root' : 'map' + outerMapNumber;
            });

            // $scope.PusherEventHandlerService = PusherEventHandlerService;
            $scope.GoogleQueryService = GoogleQueryService;
            $scope.mapheight = 450;
            $scope.mapwidth = 380;
            $scope.mapHosterInstance = null;

            $scope.destSelections = [
                {'option' : "Same Window", 'showing' : "destination-option-showing"},
                {'option' : "New Tab", 'showing' : "destination-option-showing"},
                {'option' : "New Pop-up Window", 'showing' : "destination-option-showing"}];
            $scope.selectedDestination = "Same Window";
            $scope.gsearch = {};
            $scope.data = {
                dstSel : $scope.destSelections[0].option,
                prevDstSel : $scope.destSelections[0].option,
                title : 'map has no title',
                icon : null,
                snippet : 'nothing in snippet',
                mapType : $scope.currentMapSystem.maptype,
                imgSrc : $scope.currentMapSystem.imgSrc,
                destSelections : $scope.destSelections,
                query : "no query yet"

            };
            $scope.preserveState = function () {
                console.log("preserveState");

                $scope.data.prevDstSel = $scope.data.dstSel;
                console.log("preserve " + $scope.data.prevDstSel + " from " + $scope.data.dstSel);
            };

            $scope.restoreState = function () {
                console.log("restoreState");

                console.log("restore " + $scope.data.dstSel + " from " + $scope.data.prevDstSel);
                $scope.data.dstSel = $scope.data.prevDstSel;
            };
            $scope.updateState = function (selectedDestination) {
                console.log("updateState");
                $scope.selectedDestination  = selectedDestination;
                $scope.data.dstSel = $scope.data.prevDstSel = selectedDestination;
            };

            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };
            // function refreshLinker() {
            //     var lnkrText = document.getElementById("idLinkerText"),
            //         lnkrSymbol = document.getElementById("idLinkerSymbol"),
            //         lnkrTxt,
            //         lnkrSmbl;
            //     if (lnkrSymbol && lnkrText) {
            //         lnkrTxt =  MapLinkrMgrCtrl.getLinkrMgrData().ExpandPlug;
            //         lnkrText.innerHTML = lnkrTxt;
            //         console.log("refresh Linker Text with " + lnkrText.innerHTML);
            //         lnkrSmbl = "../img/" + MapLinkrMgrCtrl.getLinkrMgrData().mapLinkrBtnImage + ".png";
            //         lnkrSymbol.src = lnkrSmbl;
            //         console.log("refresh Linker Symbol with " + lnkrSymbol.src);
            //     }
            // }

            $scope.startMap = function (mapNumber, mapType) {
                initialize(mapNumber, mapType);
            };
            function setupMapHoster(mapHoster, aMap) {
                // var
                //     popmapString = "click me for map " + mapHoster.getMapNumber(),
                //     contentString = "<div><a ng-click='clickTest()'>" + popmapString + "</a></div>";
                    // compiledMsg = $compile(contentString)($scope);
                // mapStartup.configure(configMapNumber, mapLocOptions);

                $scope.mapHosterInstance = mapHoster;
                console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.getMapNumber());
                console.log("Try accessor " + mapStartup.getMapNumber());
                // console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
                MapInstanceService.setMapHosterInstance(mapHoster.getMapNumber(), mapHoster);
                // mapHoster.addPopup(compiledMsg[0], centerCoord);
            }

            function placesQueryCallback(placesFromSearchArg, status) {
                var
                    currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
                    googmph,
                    curMapType = "no map",
                    placesSearchResults,
                    onAcceptDestination,
                    placesFromSearch = placesFromSearchArg,
                    startNewCanvas;

                selfVars.placesFromSearch = placesFromSearchArg || selfVars.placesFromSearch;
                console.log('status is ' + status);
                utils.hideLoading();

                startNewCanvas = function (mapType) {
                    console.log('startNewCanvas with Promise');
                    return new Promise(function (resolve, reject) {
                        console.log("call CanvasHolderCtrl.addCanvas");
                        CanvasHolderCtrl.addCanvas(mapType);
                        resolve(mapType);
                    });
                    // if (placesFromSearch && placesFromSearch.length > 0) {
                    //     placesSearchResults = placesFromSearch;
                    //     selfVars.searchInput = document.getElementById('pac-input' + currentSlideNumber);
                    //
                    //     $scope.subsetDestinations(placesFromSearch);
                    //
                    // } else {
                    //     console.log('searchBox.getPlaces() still returned no results');
                    // }
                };

                function fillNewCanvas(placesFromSearchArg) {
                    console.log('fillNewCanvas');
                    var
                        slideNumber = CarouselCtrl.getCurrentSlideNumber(),
                        mph = MapInstanceService.getMapHosterInstance(slideNumber);
                    placesFromSearch = placesFromSearchArg;
                    if (placesFromSearch && placesFromSearch.length > 0) {
                        // placesSearchResults = placesFromSearch;
                        selfVars.searchInput = document.getElementById('pac-input' + slideNumber);

                        // $scope.subsetDestinations(placesFromSearch);

                        // mph.setPlacesFromSearch(placesFromSearch);
                        mph.placeMarkers(placesFromSearch);

                    } else {
                        console.log('searchBox.getPlaces() still returned no results');
                    }

                }

                function stageStartNewCanvas() {
                    console.log('stageStartNewCanvas');
                    queryForNewDisplay = "";
                    startNewCanvas('google').then(function (mapType) {
                        console.log("resolve calls addCanvas");
                        // CanvasHolderCtrl.addCanvas(mapType);
                    }).then(function () {
                        // fillNewCanvas(selfVars.placesFromSearch);
                        console.log('do nothing here');
                    });
                }
                function fillMapWithMarkers() {
                    console.log("fillMapWithMarkers calling fillNewCanvas");
                    fillNewCanvas(selfVars.placesFromSearch);
                }
                selfMethods.fillMapWithMarkers = fillMapWithMarkers;

                onAcceptDestination = function (info) {
                    var sourceMapType = 'google',
                        newSelectedWebMapId,
                        destWnd,
                        customControlElement;


                    if (info) {
                        sourceMapType = 'google';
                        destWnd = info.dstSel;
                    }
                    newSelectedWebMapId = "NoId";

                    if (destWnd === 'New Pop-up Window' || destWnd === 'New Tab') {
                        if (PusherConfig.isNameChannelAccepted() === false) {
                            PusherSetupCtrl.setupPusherClient(stageStartNewCanvas,
                                {
                                    'destination' : destWnd,
                                    'currentMapHolder' : sourceMapType,
                                    'newWindowId' : newSelectedWebMapId,
                                    'query' : queryForNewDisplay
                                });
                            queryForNewDisplay = "";
                            // startNewCanvas(null, null, null, 'google').then(function(mapType) {
                            //     CanvasHolderCtrl.addCanvas(mapType);
                            // }).then(function() {
                            //     fillNewCanvas(selfVars.placesFromSearch);
                            // });
                        } else {
                            startNewCanvas('google').then(function (mapType) {
                                // CanvasHolderCtrl.addCanvas(mapType);
                                console.log("do nothing in first then section");
                            }).then(function () {
                                fillNewCanvas(selfVars.placesFromSearch);
                            });
                            // WindowStarter.openNewDisplay(mlconfig.masherChannel(false),
                            //     mlconfig.getUserName(), destWnd, sourceMapType, newSelectedWebMapId, queryForNewDisplay);
                            queryForNewDisplay = "";
                        }

                    } else {  //(destWnd == "Same Window")
                        googmph = MapInstanceService.getMapHosterInstance(currentSlideNumber);
                        removeCustomControls(currentSlideNumber);
                        // googmph.placeMarkers(placesSearchResults);
                        fillNewCanvas(selfVars.placesFromSearch);
                        mlconfig.setQuery(queryForNewDisplay);
                        queryForSameDisplay = queryForNewDisplay;
                    }
                };

                if (placesFromSearch && placesFromSearch.length > 0) {
                    placesSearchResults = placesFromSearch;
                    selfVars.searchInput = document.getElementById('pac-input' + currentSlideNumber);

                    $scope.subsetDestinations(placesFromSearch);

                    gmQSvc = $scope.GoogleQueryService;
                    scope = gmQSvc.getQueryDestinationDialogScope(curMapType);
                    $scope.showDestDialog(
                        onAcceptDestination,
                        scope,
                        {
                            'id' : null,
                            'title' : selfVars.searchInput.value,
                            'snippet' : 'No snippet available',
                            'icon' : 'img/googlemap.png',
                            'mapType' : CurrentMapTypeService.getCurrentMapType()
                        }
                    );
                } else {
                    console.log('searchBox.getPlaces() still returned no results');
                }
            }

            function connectQuery() {
                var
                    mapLinkrBounds,
                    searchBounds,
                    position,
                    center,
                    googleCenter,
                    gmap,
                    mapLocOptions,
                    pacinput,
                    queryPlaces = {},
                    service,
                    currentSlideNumber = CarouselCtrl.getCurrentSlideNumber();
                    // googmph = MapInstanceService.getMapHosterInstance(currentSlideNumber);  //CurrentMapTypeService.getSpecificMapType('google');

                mapLinkrBounds = mlconfig.getBounds();
                searchBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng({'lat' : mapLinkrBounds.lly, 'lng' : mapLinkrBounds.llx}),
                    new google.maps.LatLng({'lat' : mapLinkrBounds.ury, 'lng' : mapLinkrBounds.urx})
                );
                position = mlconfig.getPosition();
                center = {'lat' : position.lat, 'lng' : position.lon};
                googleCenter = new google.maps.LatLng(position.lat, position.lon);
                // gmap = googmph.getMap();
                utils.showLoading();
                if (!gmap) {
                    mapLocOptions = {
                        center : googleCenter,
                        zoom : 15,
                        mapTypeId : google.maps.MapTypeId.ROADMAP
                    };
                    gmap = new google.maps.Map(document.getElementById("hiddenmap_canvas"), mapLocOptions);
                }

                // placesFromSearch = searchBox.getPlaces();

                pacinput = document.getElementById('pac-input' + currentSlideNumber);
                queryPlaces.bounds = searchBounds;
                queryPlaces.query = pacinput.value;
                queryPlaces.location = center;
                // mlconfig.setQuery(queryPlaces.query);

                service = new google.maps.places.PlacesService(gmap);
                if (queryPlaces.query !== '') {
                    service.textSearch(queryPlaces, placesQueryCallback);
                }
            }

/*
    setupQueryListener has to be called from the map hosters after they instantiate their native map,
    because the map elements they introduce overwrite the pac-input element created here.
*/
            function setupQueryListener(mapType) {
                var
                    cnvs, //  = utils.getElemById(whichCanvas),
                    curMapType = mapType || 'arcgis',  // mlconfig.getMapType(), // CurrentMapTypeService.getMapTypeKey(),
                    currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
                    fnLink,
                    pacinput,
                    pacinputParent,
                    pacinputElement,
                    templateUnformatted =
                    ' \
                    <div id="gmsearch{0}" \
                        class="gmsearchclass" \
                        style="width: 28em; margin-right : 2em;"> \
                        <input id="pac-input{1}" \
                            class="gmsearchcontrols" className="controls" \
                            type="text" onclick="cancelBubble=true;" onmousemove="event.stopPropagation();" \
                            onmousedown="event.stopPropagation();" onmouseup="event.stopPropagation();" \
                            placeholder="Search Google Places"  \
                            ng-class="{\'gmsposition-rel\' : !gsearch.isGoogle, \'gmsposition-abs\' : gsearch.isGoogle}" \
                            ng-model="gsearch.query" \
                            ng-change="queryChanged()" auto-focus > \
                    </div>',
                    template = templateUnformatted.format(currentSlideNumber, currentSlideNumber);
                // curMapType = CurrentMapTypeService.getMapTypeKey(),
                selfVars.curMapType = curMapType;
                if (curMapType === 'google') {
                    $scope.gsearch.isGoogle = true;
                    whichCanvas = 'map' + currentSlideNumber;
                } else {
                    $scope.gsearch.isGoogle = false;
                    if (curMapType === 'arcgis') {
                        whichCanvas = 'map' + currentSlideNumber + '_root'; // 'map_canvas_root';
                        pacinputElement = document.getElementById('pac-input' + currentSlideNumber);
                        if (pacinputElement) {
                            pacinputParent = pacinputElement.parentElement;
                            pacinputParent.removeChild(pacinputElement);
                        }
                    } else {
                        whichCanvas = 'map' + currentSlideNumber;
                    }
                }

                pacinput = document.getElementById('pac-input' + currentSlideNumber);
                if (!pacinput) {
                    pacinput = angular.element(template);
                    cnvs = utils.getElemById(whichCanvas);
                    cnvs.append(pacinput);
                    fnLink = $compile(pacinput);
                    fnLink($scope);
                }

                $scope.safeApply();

                setTimeout(function () {
                    // selfVars.searchInput = /** @type {HTMLInputElement} */ (document.getElementById('pac-input' + currentSlideNumber));
                    console.log("in outer setTimeout setting up selfVars.searchInput");
                    console.debug(selfVars.searchInput);
                    selfVars.searchInput = document.getElementById('pac-input' + currentSlideNumber);
                    if (selfVars.searchInput) {
                        // mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(selfVars.searchInput);
                        selfVars.searchInput.value = '';
                        searchBox = new google.maps.places.SearchBox(selfVars.searchInput);

                        google.maps.event.addListener(searchBox, 'places_changed', function () {
                            console.log("MapCtrl 'places_changed' listener");
                            connectQuery(selfVars.curMapType);
                            selfVars.searchInput.blur();
                            setTimeout(function () {
                                console.log("in inner setTimeout setting up selfVars.searchInput");
                                console.debug(selfVars.searchInput);
                                selfVars.searchInput.value = '';
                            }, 10);
                        });
                    }
                }, 500);
            }

            selfMethods.setupQueryListener = setupQueryListener;

            $scope.$on('minmaxDirtyEvent', function (event, args) {
                refreshMinMax();
            });

            $scope.queryChanged = function () {
                queryForNewDisplay = $scope.gsearch.query;
                if ($scope.gsearch.query.includes(13)) {
                    mlconfig.setQuery($scope.gsearch.query);
                    if (queryForSameDisplay === "") {
                        queryForSameDisplay = queryForNewDisplay;
                    }
                }
            };

            $scope.showDestDialog = function (callback, details, info) {
                console.log("showDestDialog for currentMapSystem " + $scope.currentMapSystem.title);
                $scope.preserveState();

                $scope.data.mapType = $scope.currentMapSystem.maptype;
                $scope.data.icon = $scope.currentMapSystem.imgSrc;
                $scope.data.query = $scope.gsearch.query;
                $scope.data.callback = callback;
                if (info) {
                    $scope.data.icon = info.icon;
                    $scope.data.title = info.title;
                    $scope.data.snippet = info.snippet;
                    $scope.data.mapType = info.mapType;
                    $scope.data.id = info.id;
                }

                modalInstance = $uibModal.open({
                    templateUrl : '/templates/DestSelectDlgGen.html',   // .jade will be appended
                    controller : 'DestWndSetupCtrl',
                    backdrop : true,
                    animation : false,
                    animate : 'none',
                    windowClass : 'no-animation-modal',
                    uibModalAnimationClass : 'none',

                    resolve : {
                        data: function () {
                            return $scope.data;
                        }
                    }
                });

                modalInstance.result.then(function (info) {
                    $scope.updateState(info.dstSel);
                    $scope.data.callback(info);
                    $uibModalStack.dismissAll("go away please");
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                    $scope.restoreState();
                });

            };

            $scope.clickTest = function () {
                var mapNumber = MapInstanceService.getSlideCount();
                alert('infowindow with ng-click on map ' + mapNumber);
            };
            $scope.$on('invalidateCurrentMapTypeConfigured', function () {
                invalidateCurrentMapTypeConfigured();
            });
            $scope.subsetDestinations = function (placesFromSearch) {
                var curMapType = selfVars.curMapType; // CurrentMapTypeService.getMapTypeKey(),
                    // currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
                    // configInst = MapInstanceService.getConfigInstanceForMap(currentSlideNumber),
                    // googmph = configInst.getMapHosterInstance();
                    // googmph = MapInstanceService.getMapHosterInstance(currentSlideNumber);
                // console.log("subsetDestinations for map id " + currentSlideNumber);
                // console.debug(googmph);

                if (curMapType === 'google') {
                //     if (placesFromSearch) {
                //         googmph.setPlacesFromSearch(placesFromSearch);
                        // googmph.placeMarkers(placesFromSearch);
                    // }
                    $scope.destSelections[0].showing = 'destination-option-showing';
                } else {
                    // do not show smae window if the query isn't coming from a google map.
                    $scope.destSelections[0].showing = 'destination-option-hidden';
                    $scope.data.dstSel = $scope.destSelections[2].option;
                }
            };

            $scope.gsearchVisible = 'inline-block';
            whichCanvas = selfVars.curMapType === 'arcgis' ? 'map' + outerMapNumber + '_root' : 'map' + outerMapNumber;
            $scope.selectedDestination = selfVars.curMapType === 'google' ? 'Same Window' : 'New Pop-up Window';
            $scope.updateState($scope.selectedDestination);

            if (gmquery !== '') {
                $scope.gsearch = {'query' : gmquery};  // was read from url when opening new window
            } else {
                $scope.gsearch = {'query' : 'SearcherBox'};
            }

            // currentMapType = CurrentMapTypeService.getCurrentMapType();
            //
            // stup = currentMapType.start();

            tmpltName = $routeParams.id;
            console.log("$routeParams.id is " + tmpltName);

            function configureCurrentMapType(mapLocOptions) {
                currentMapType = CurrentMapTypeService.getMapStartup();
                if (currentMapType.configure) {
                    currentMapType.configure(null, mapLocOptions);
                    $scope.map = currentMapType.getMap();
                    // $scope.map.width = mapSize['medium'];
                    // $scope.MapWdth = mapSize['small'];
                    $scope.isMapExpanded = false;
                    console.debug($scope.map);
                    curMapTypeInitialized = true;
                }
            }

            selfMethods.configureCurrentMapType = configureCurrentMapType;
            commonInitialized = true;
        }

        function initialize(mapNo, mapType, setupMapHoster) {
            var
                mapHoster,
                centerCoord,
                mapLocOptions = null,
                mapNumber = mapNo,
                mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                configMapNumber = mapConfig.getMapId(),
                pos = mapConfig.getPosition(),
                popmapString = "click me for map " + configMapNumber,
                contentString = "<div><a ng-click='clickTest()'>" + popmapString + "</a></div>",
                compiledMsg = $compile(contentString)($scope);

            console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
            console.log("initialize MapCtrl with map id " + mapNo);
            console.log(compiledMsg);
            curMapTypeInitialized = true;
            console.log("curMapTypeInitialized is " + curMapTypeInitialized);
            centerCoord = { lat: pos.lat, lng: pos.lon};
            mapLocOptions = {
                center: centerCoord,
                zoom: pos.zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            if (mapType === 'google') {
                mapStartup = new StartupGoogle.StartupGoogle(mapNumber, mapConfig);
            } else if (mapType === 'leaflet') {
                mapStartup = new StartupLeaflet.StartupLeaflet(mapNumber, mapConfig);
            } else {
                mapStartup = new StartupArcGIS.StartupArcGIS(mapNumber, mapConfig, setupMapHoster);
            }
            // mapStartups.push(mapStartup);
            // setTimeout(function() {
            mapStartup.configure(configMapNumber, mapLocOptions);
            mapHoster = mapStartup.getMapHosterInstance(configMapNumber);
            mapConfig.setMapHosterInstance(mapHoster); // MapInstanceService.getMapHosterInstance(mapNumber));
            MapInstanceService.setMapHosterInstance(mapNumber, mapHoster);
            // fillNewCanvas(selfVars.placesFromSearch);
            //     $scope.mapHosterInstance = mapHoster;
            //     console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.getMapNumber());
            //     console.log("Try accessor " + mapStartup.getMapNumber());
            //     // console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
            //     MapInstanceService.setMapHosterInstance(mapNumber, mapHoster);
            //     mapHoster.addPopup(compiledMsg[0], centerCoord);
            //   }, 1000);
        }
          // google.maps.event.addDomListener(window, 'load', initialize);
        function removeChildrenFromNode(node) {
             if(node === undefined || node === null) {
                return;
            	}
              while (node.firstChild) {
                  node.removeChild(node.firstChild);
              }
          }

        function removeCustomControls(mapNo) {
            var elem,
                elems = ['gmsearch' + mapNo, 'linkerDirectiveId' + mapNo, 'mapmaximizerDirectiveId' + mapNo];
                // elems = ['linkerDirectiveId', 'idLinkerText', 'idLinkerSymbol', 'mapmaximizerDirectiveId', 'idMinMaxText', 'idMinMaxSymbol', 'idMinMaxSymbol'];
            for (elem = 0; elem < elems.length; elem += 1) {
                //  elem = document.getElementById('slide' + slideToRemove);
                removeChildrenFromNode(elem);
            }
        }

        function placeCustomControls() {
            var currentMapNumber = mapStartup.getMapNumber(),
                contextScope = $scope,
                cnvs,
                // templateUrl,
                templateLnkr,
                templateLnkrUnformatted,
                templateMinMaxr,
                templateMinMaxrUnformatted,
                lnkr1,
                lnkr,
                minmaxr1,
                minmaxr,
                lnkrdiv,
                mnmxdiv,
                lnkrText,
                lnkrSymbol,
                refreshDelay;
            function stopLintUnusedComplaints(lnkr, minmaxr) {
                console.log("stopLintUnusedComplaints");
            }
            if (document.getElementById("linkerDirectiveId" + currentMapNumber) === null) {

                whichCanvas = CurrentMapTypeService.getMapTypeKey() === 'arcgis' ? 'map' + currentMapNumber + '_root' : 'map' + currentMapNumber;
                cnvs = utils.getElemById(whichCanvas);
                templateLnkrUnformatted = '\
                    <div id="linkerDirectiveId{0}" class="lnkrclass">\
                    <label id="idLinkerText{1}" class="lnkmaxcontrol_label lnkcontrol_margin"\
                        style="cursor:url(../img/LinkerCursor.png) 9 9,auto; font-size: 1em;">\
                    </label>\
                    <img id="idLinkerSymbol{2}" class="lnkmaxcontrol_symbol lnkcontrol_margin"\
                        style="cursor:url(../img/LinkerCursor.png) 9 9,auto;">\
                    </div>';
                templateLnkr = templateLnkrUnformatted.format(currentMapNumber, currentMapNumber, currentMapNumber);

                templateMinMaxrUnformatted = ' \
                    <div id="mapmaximizerDirectiveId{0}" class="mnmxclass" > \
                    <label id="idMinMaxText{1}" class="lnkmaxcontrol_label maxcontrol_margin" \
                        style="cursor:url(../img/LinkerCursor.png) 9 9,auto; font-size: 1em;"> \
                    </label> \
                    <img id="idMinMaxSymbol{2}" class="lnkmaxcontrol_symbol maxcontrol_margin" \
                         style="cursor:url(../img/LinkerCursor.png) 9 9,auto;"> \
                    </div>';
                templateMinMaxr = templateMinMaxrUnformatted.format(currentMapNumber, currentMapNumber, currentMapNumber);
                lnkr1 = angular.element(templateLnkr);
                lnkr = cnvs.append(lnkr1);

                minmaxr1 = angular.element(templateMinMaxr);
                minmaxr = cnvs.append(minmaxr1);

                stopLintUnusedComplaints(lnkr, minmaxr);
                $scope.safeApply();

                setTimeout(function () {
                    lnkrdiv = document.getElementById('linkerDirectiveId' + currentMapNumber);
                    lnkrdiv.addEventListener('click', function (event) {
                        console.log('lnkr[0].onclick   display LinkerEvent');
                        event.stopPropagation();

                        LinkrSvc.showLinkr();
                    });
                    mnmxdiv = document.getElementById('mapmaximizerDirectiveId' + currentMapNumber);

                    mnmxdiv.addEventListener('click', function (event) {
                        console.log('minmaxr[0].onclick   mapMaximizerEvent');
                        event.stopPropagation();
                        contextScope.$emit('mapMaximizerEvent');
                        contextScope.$apply();
                        refreshMinMax();
                    });
                }, 500);


                lnkrText = document.getElementById("idLinkerText" + currentMapNumber);
                lnkrSymbol = document.getElementById("idLinkerSymbol" + currentMapNumber);
                refreshDelay = 500;
                if (lnkrSymbol && lnkrText) {
                    refreshDelay = 10;
                }
                setTimeout(function () {
                    refreshLinker(currentMapNumber);
                    refreshMinMax(currentMapNumber);
                }, refreshDelay);
            }
            // else {
            //     refreshDelay = 500;
            //     setTimeout(function () {
            //         setupQueryListener();
            //         refreshLinker();
            //         refreshMinMax();
            //     }, refreshDelay);
            // }
            // connectQuery();
        }

        // function placeCustomControls() {
        //     console.log("MapCtrl.placeCustomControls");
        // }
        selfMethods.placeCustomControls = placeCustomControls;

        // $scope.gsearchVisible = 'inline-block';
        // if (gmquery !== '') {
        //     $scope.gsearch = {'query' : gmquery};  // was read from url when opening new window
        // } else {
        //     $scope.gsearch = {'query' : 'SearcherBox'};
        // }


        function MapCtrlMobile($scopeArg, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $routeParams, $compile, $uibModal, $uibModalStack,
                    LinkrSvc, MapInstanceService, CurrentMapTypeService, GoogleQueryService, SiteViewService) {
            var watchOptions,
                watch;
            console.log("In mobile MapCtrl controller fire away");
            $scope = $scopeArg;

            function initializeLocation() {
                console.log("In initialize MOBILE");
                var
                    mapLocOptions = {
                        center: new google.maps.LatLng(37.422858, -122.085065),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    options = {
                        timeout: 20000,
                        maximumAge: 0,
                        enableHighAccuracy: true
                    };
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
                });

                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
                    $ionicLoading.hide();
                }
                // window.setPageTitle();
                // $rootScope.$on('$stateChangeSuccess', function (event) {
                // window.setPageTitle();
                //     console.debug(event);
                // });

                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    console.log("in $cordovaGeolocation.getCurrentPosition callback");
                    // var latLng = new google.maps.LatLng(33.5432, -112.075)
                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    mapLocOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    console.log("ready to create/show Map in callback");
                    console.log("center; " + mapLocOptions.center.lng() + ", " + mapLocOptions.center.lat());
                    $ionicLoading.hide();
                    mlmap = utils.showMap(mapLocOptions);
                    // $scope.map = new google.maps.Map(document.getElementById("mapdiv"), mapLocOptions);

                }, function (error) {
                    console.log("Could not get location from $cordovaGeolocation.getCurrentPosition");
                    alert("Could not get location");
                    if (navigator.geolocation) {
                        console.log("ready to getCurrentPosition from google navigator");
                        navigator.geolocation.getCurrentPosition(function (position) {
                            console.log("in navigator getCurrentPosition callback");

                            mapLocOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            console.log("mapLocOptions.center " + mapLocOptions.center.lng() + ", " + mapLocOptions.center.lat());
                            console.debug(mapLocOptions);
                            // mlmap = utils.showMap(mapLocOptions);
                            mlmap = configureCurrentMapType(mapLocOptions);
                            $ionicLoading.hide();
                        },
                            function () {
                                console.log("error in navigator.geolocation.getCurrentPosition");
                                $ionicLoading.hide();
                                handleLocationError(true, infoWindow, mlmap.getCenter());
                            });
                        $ionicLoading.hide();
                    } else {
                        console.log("Fall thru to default map display");
                        $ionicLoading.hide();
                        mlmap = utils.showMap(mapLocOptions);
                        console.debug(error);
                    }
                    $ionicLoading.hide();
                    console.log("fell thru navigator.geolocation.getCurrentPosition");
                    initializeCommon($scope, $routeParams, $compile, $uibModal, $uibModalStack, MapInstanceService, LinkrSvc,
                        CurrentMapTypeService, GoogleQueryService, SiteViewService);
                });

                watchOptions = {
                    timeout: 3000,
                    enableHighAccuracy: true
                };
                watch = $cordovaGeolocation.watchPosition(watchOptions);

                watch.then(
                    null,

                    function (err) {
                        console.log(err);
                    },

                    function (position) {
                        var lat = position.coords.latitude,
                            long = position.coords.longitude;

                        'position - lat {0}, lon{1}'.format(lat, long);
                        mlmap.setCenter(position);
                        utils.geoLocate(position, mlmap, "Changed positions");
                    }
                );

                watch.clearWatch();

                // function toPluginPosition(lat, lng) {
                //     return new plugin.google.maps.LatLng(lat, lng);
                // }

                // mapdiv = document.getElementById("mapdiv");

                // Invoking Map using Google Map SDK v2 by dubcanada
                // mlmap = plugin.google.maps.Map.getMap(mapdiv, {
                //     'camera': {
                //         'latLng': toPluginPosition(-19.9178713, -43.9603117),
                //         'zoom': 10
                //     }
                // });
            }
            selfMethods.initialize = initialize;
            $ionicPlatform.ready(initialize);
            // console.log("addEventListener for deviceready after wait 5000");
            // setTimeout(function () {
            //     document.addEventListener("deviceready", initialize);
            //     console.log("wait 5000");
            // }, 5000);
        }

        function MapCtrlBrowser($scopeArg, $routeParams, $compile, $uibModal, $uibModalStack, MapInstanceService, LinkrSvc,
                    CurrentMapTypeService, GoogleQueryService, SiteViewService) {
            console.log("in MapCtrlBrowser");
            $scope = $scopeArg;

            function initializeLocation() {
                console.log("MapCtrl.initialize NOT MOBILE");
                var outerMapNumber = MapInstanceService.getSlideCount(),
                    mapLocOptions = {
                        center: new google.maps.LatLng(37.422858, -122.085065),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
                }

                if (firstMap === true && navigator.geolocation) {
                    console.log("ready to getCurrentPosition");
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log("getCurrentPosition");
                        console.log("at " + position.coords.latitude + ", "  + position.coords.longitude);

                        mapLocOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        /// mapConfig = MapInstanceService.getConfigInstanceForMap(outerMapNumber),
                        // if (!mlconfig) {
                        //     mlconfig = new MLConfig.MLConfig(outerMapNumber);
                        //     MapInstanceService.setConfigInstanceForMap(outerMapNumber, angular.copy(mlconfig));
                        // }
                        mlconfig = new MLConfig.MLConfig(outerMapNumber);
                        mlconfig.setMapType('google');
                        mlconfig.setPosition({'lon' : position.coords.longitude, "lat" : position.coords.latitude, "zoom" : 15});
                        MapInstanceService.setConfigInstanceForMap(outerMapNumber, mlconfig);
                        console.log("MapCtrl will now call CanvasHolderCtrl.addCanvas");
                        firstMap = false;
                        CanvasHolderCtrl.addCanvas('google', mlconfig);
                        firstMap = false;
                        // initialize(0, 'google');
                        // mapStartup = new StartupGoogle.StartupGoogle(outerMapNumber, mlconfig);
                        // mlmap = utils.showMap(mapLocOptions);
                        mlmap = configureCurrentMapType(mapLocOptions);
                    },
                        function () {
                            handleLocationError(true, infoWindow, mlmap.getCenter());
                        });
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, mlmap.getCenter());
                    mlmap = utils.showMap(mapLocOptions);
                }
            }
            // selfMethods.initialize = initialize;
            if (firstMap === true) {
                initializeLocation();
                if (commonInitialized === false) {
                    initializeCommon($scope, $routeParams, $compile, $uibModal, $uibModalStack, MapInstanceService, LinkrSvc,
                                CurrentMapTypeService, GoogleQueryService, SiteViewService);
                }
            }
            // google.maps.event.addDomListener(document.getElementById('mapdiv'), 'load', function () {
            //     console.log("addDomListener window load callback");
            //     initialize();
            // });
            // $ionicPlatform.ready(initialize);
        }

        function invalidateCurrentMapTypeConfiguredOuter() {
            console.log("invalidateCurrentMapTypeConfigured");
            if (selfMethods.invalidateCurrentMapTypeConfigured) {
                selfMethods.invalidateCurrentMapTypeConfigured();
            }
        }

        function getSearchBox() {
            selfMethods.getSearchBox();
        }

        function setupQueryListener(mapType) {
            console.log("setupQueryListener");
            if (selfMethods.setupQueryListener) {
                selfMethods.setupQueryListener(mapType);
            }
        }

        function fillMapWithMarkers() {
            if (selfMethods.fillMapWithMarkers) {
                selfMethods.fillMapWithMarkers();
            }
        }
        function configureCurrentMapType(mapLocOptions) {
            console.log("configureCurrentMapType");
            selfMethods.configureCurrentMapType(mapLocOptions);
        }

        function init(isMob) {
            console.log('MapCtrl outer init');
            var App = angular.module('mapModule');

            if (isMob) {
                MapCtrl = App.controller('MapCtrl', ['$scope', '$cordovaGeolocation',
                    '$ionicLoading', '$ionicPlatform', '$routeParams', '$compile', '$uibModal', '$uibModalStack',
                    'MapInstanceService', 'LinkrService', 'CurrentMapTypeService',
                    'GoogleQueryService', 'SiteViewService', MapCtrlMobile]);
            } else {
                MapCtrl = App.controller('MapCtrl', ['$scope',
                    '$routeParams', '$compile', '$uibModal', '$uibModalStack', 'MapInstanceService',
                    'LinkrService', 'CurrentMapTypeService',
                    'GoogleQueryService', 'SiteViewService', MapCtrlBrowser]);

                console.log("ready to create MapCtrl");
            }
            return MapCtrl;
        }

        return {
            start: init,
            configureCurrentMapType: configureCurrentMapType,
            invalidateCurrentMapTypeConfigured : invalidateCurrentMapTypeConfiguredOuter,
            placeCustomControls : placeCustomControls,
            setupQueryListener : setupQueryListener,
            fillMapWithMarkers : fillMapWithMarkers,
            getSearchBox: getSearchBox
        };
    });
// }());
}).call(this);
