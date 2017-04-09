/*global define, require, console, google, document, window, navigator, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'libs/StartupGoogle',
        'libs/StartupArcGIS',
        'libs/StartupLeaflet',
        'libs/utils',
        'controllers/MapLinkrMgrCtrl'
    ], function (app, StartupGoogle, StartupArcGIS, StartupLeaflet, utils, MapLinkrMgrCtrl) {
        var selfMethods = {},
            curMapTypeInitialized = false,
            whichCanvas,
            searchInput,
            searchBox,
            mapStartup,
            placeCustomControls;

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            '$compile',
            'MapInstanceService',
            'LinkrService',
            'CurrentMapTypeService',
            'PusherEventHandlerService',
            'GoogleQueryService',
            'SiteViewService',
            function ($scope, $compile, MapInstanceService, LinkrService,
                CurrentMapTypeService, PusherEventHandlerService, GoogleQueryService, SiteViewService) {
                var outerMapNumber = MapInstanceService.getSlideCount(),
                    mlconfig = MapInstanceService.getConfigInstanceForMap(outerMapNumber);
                    // gmquery = mlconfig.query();
                // var mapNumber = MapInstanceService.getSlideCount(),
                //     mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                //     configMapNumber = mapConfig.getMapId();
                    // mapStartups = [];
                // console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                $scope.PusherEventHandlerService = PusherEventHandlerService;
                $scope.GoogleQueryService = GoogleQueryService;
                $scope.mapheight = 450;
                $scope.mapwidth = 380;
                $scope.mapHosterInstance = null;
                $scope.gsearch = {};

                function invalidateCurrentMapTypeConfigured() {
                    curMapTypeInitialized = false;
                }
                selfMethods.invalidateCurrentMapTypeConfigured = invalidateCurrentMapTypeConfigured;

                function setupMapHoster(mapHoster, aMap) {
                    var
                        popmapString = "click me for map " + mapHoster.getMapNumber(),
                        contentString = "<div><a ng-click='clickTest()'>" + popmapString + "</a></div>",
                        compiledMsg = $compile(contentString)($scope);
                    // mapStartup.configure(configMapNumber, mapOptions);

                    $scope.mapHosterInstance = mapHoster;
                    console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.getMapNumber());
                    console.log("Try accessor " + mapStartup.getMapNumber());
                    // console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
                    MapInstanceService.setMapHosterInstance(mapHoster.getMapNumber(), mapHoster);
                    // mapHoster.addPopup(compiledMsg[0], centerCoord);
                }
                function setupQueryListener() {
                    var
                        cnvs, //  = utils.getElemById(whichCanvas),
                        curMapType = CurrentMapTypeService.getMapTypeKey(),
                        fnLink,
                        pacinput,
                        pacinputParent,
                        pacinputElement,
                        template = ' \
                            <div id="gmsearch" \
                                class="gmsearchclass" \
                                style="width: 28em; margin-left: 7em; margin-right : 2em;"> \
                                <input id="pac-input" \
                                    class="gmsearchcontrols" className="controls" \
                                    type="text" onclick="cancelBubble=true;" onmousemove="event.stopPropagation();" \
                                    onmousedown="event.stopPropagation();" onmouseup="event.stopPropagation();" \
                                    placeholder="Search Google Places"  \
                                    ng-class="{\'gmsposition-rel\' : !gsearch.isGoogle, \'gmsposition-abs\' : gsearch.isGoogle}" \
                                    ng-model="gsearch.query" \
                                    ng-change="queryChanged()" auto-focus > \
                            </div>';
                    // curMapType = CurrentMapTypeService.getMapTypeKey(),
                    if (curMapType === 'google') {
                        $scope.gsearch.isGoogle = true;
                    } else {
                        $scope.gsearch.isGoogle = false;
                        if (curMapType === 'arcgis') {
                            whichCanvas = 'map' + mapStartup.getMapNumber() + '_root'; // 'map_canvas_root';
                            // whichCanvas = curMapType === 'arcgis' ? 'map' + mapStartup.getMapNumber() + '_root' : 'map' + mapStartup.getMapNumber();
                            pacinputElement = document.getElementById('pac-input');
                            if (pacinputElement) {
                                pacinputParent = pacinputElement.parentElement;
                                pacinputParent.removeChild(pacinputElement);
                            }
                        }
                    }

                    whichCanvas = curMapType === 'arcgis' ? 'map' + mapStartup.getMapNumber() + '_root' : 'map' + mapStartup.getMapNumber();
                    pacinput = document.getElementById('pac-input');
                    if (!pacinput) {
                        pacinput = angular.element(template);
                        cnvs = utils.getElemById(whichCanvas);
                        cnvs.append(pacinput);
                        fnLink = $compile(pacinput);
                        fnLink($scope);
                    }

                    $scope.safeApply();

                    setTimeout(function () {
                        searchInput = /** @type {HTMLInputElement} */ (document.getElementById('pac-input'));
                        if (searchInput) {
                            // mphmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
                            searchInput.value = '';
                            searchBox = new google.maps.places.SearchBox(searchInput);

                            google.maps.event.addListener(searchBox, 'places_changed', function () {
                                console.log("MapCtrl 'places_changed' listener");
                                connectQuery();
                                searchInput.blur();
                                setTimeout(function () {
                                    searchInput.value = '';
                                }, 10);
                            });
                        }
                    }, 500);
                }

                selfMethods.setupQueryListener = setupQueryListener;

                function initialize(mapNo, mapType) {
                    var
                        // mapHoster,
                        centerCoord,
                        mapOptions = null,
                        mapNumber = mapNo,
                        mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                        configMapNumber = mapConfig.getMapId(),
                        popmapString = "click me for map " + configMapNumber,
                        contentString = "<div><a ng-click='clickTest()'>" + popmapString + "</a></div>",
                        compiledMsg = $compile(contentString)($scope);

                    console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                    console.log("initialize MapCtrl with map id " + mapNo);
                    curMapTypeInitialized = true;
                    console.log("curMapTypeInitialized is " + curMapTypeInitialized);
                    centerCoord = { lat: 43.07493, lng: -89.381388}; // <<<<<<<<<<<<<Madison, WI

                    mapOptions = {
                        center: centerCoord,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    if (mapType === 'google') {
                        mapStartup = new StartupGoogle.StartupGoogle(mapNumber, mapConfig);
                    } else if(mapType === 'leaflet') {
                        mapStartup = new StartupLeaflet.StartupLeaflet(mapNumber, mapConfig);
                    } else {
                        mapStartup = new StartupArcGIS.StartupArcGIS(mapNumber, mapConfig, setupMapHoster);
                    }
                    // mapStartups.push(mapStartup);
                    // setTimeout(function() {
                    mapStartup.configure(configMapNumber, mapOptions);
                    //     mapHoster = mapStartup.getMapHosterInstance(configMapNumber);
                    //     $scope.mapHosterInstance = mapHoster;
                    //     console.log("MapCtrl finished configuring mapStartup with map no. " + mapStartup.getMapNumber());
                    //     console.log("Try accessor " + mapStartup.getMapNumber());
                    //     // console.log("Leaving MapCtrl initialize with mapHoster map no. " + mapHoster.getMapNumber());
                    //     MapInstanceService.setMapHosterInstance(mapNumber, mapHoster);
                    //     mapHoster.addPopup(compiledMsg[0], centerCoord);
                    //   }, 1000);
                }
                // google.maps.event.addDomListener(window, 'load', initialize);
                $scope.startMap = function (mapNumber, mapType) {
                    initialize(mapNumber, mapType);
                };

                $scope.clickTest = function () {
                    alert('infowindow with ng-click on map ' + outerMapNumber);
                };
                // initialize();
                $scope.$on('invalidateCurrentMapTypeConfigured', function () {
                    invalidateCurrentMapTypeConfigured();
                });

                function refreshLinker() {
                    var lnkrText = document.getElementById("idLinkerText"),
                        lnkrSymbol = document.getElementById("idLinkerSymbol"),
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
                        } catch(err) {
                            lnkrText.innerHTML = "Expand";
                            lnkrSmbl = "../img/Expand.png";
                        }
                    }
                }

                function placesQueryCallback(placesFromSearch, status) {
                    var googmph,
                        curMapType = "no map",
                        placesSearchResults,
                        onAcceptDestination;

                    console.log('status is ' + status);
                    utils.hideLoading();

                    onAcceptDestination = function (info) {
                        var sourceMapType,
                            evtSvc = $scope.PusherEventHandlerService,
                            newSelectedWebMapId,
                            destWnd;


                        if (info) {
                            sourceMapType = info.mapType;
                            destWnd = info.dstSel;
                        }
                        newSelectedWebMapId = "NoId";

                        if (destWnd === 'New Pop-up Window' || destWnd === 'New Tab') {
                            if (MLConfig.isNameChannelAccepted() === false) {

                                evtSvc.addEvent('client-MapXtntEvent', sourceMapType.retrievedBounds);
                                evtSvc.addEvent('client-MapClickEvent', sourceMapType.retrievedClick);

                                PusherSetupCtrl.setupPusherClient(evtSvc.getEventDct(),
                                    MLConfig.getUserName(), WindowStarter.openNewDisplay,
                                    {
                                        'destination' : destWnd,
                                        'currentMapHolder' : sourceMapType,
                                        'newWindowId' : newSelectedWebMapId,
                                        'query' : queryForNewDisplay
                                    });
                                queryForNewDisplay = "";
                            } else {
                                WindowStarter.openNewDisplay(MLConfig.masherChannel(false),
                                    MLConfig.getUserName(), destWnd, sourceMapType, newSelectedWebMapId, queryForNewDisplay);
                                queryForNewDisplay = "";
                            }

                        } else {  //(destWnd == "Same Window")
                            googmph = CurrentMapTypeService.getSpecificMapType('google');
                            googmph.placeMarkers(placesSearchResults);
                            MLConfig.setQuery(queryForNewDisplay);
                            queryForSameDisplay = queryForNewDisplay;
                        }
                    };

                    if (placesFromSearch && placesFromSearch.length > 0) {
                        placesSearchResults = placesFromSearch;


                        $scope.subsetDestinations(placesFromSearch);

                        gmQSvc = $scope.GoogleQueryService;
                        scope = gmQSvc.getQueryDestinationDialogScope(curMapType);
                        $scope.showDestDialog(
                            onAcceptDestination,
                            scope,
                            {
                                'id' : null,
                                'title' : searchInput.value,
                                'snippet' : 'No snippet available',
                                'icon' : 'img/googlemap.png',
                                'mapType' : CurrentMapTypeService.getCurrentMapType()
                            }
                        );
                    } else {
                        console.log('searchBox.getPlaces() still returned no results');
                    }
                }

                function connectQuery () {
                    var googmph,
                        mapLinkrBounds,
                        searchBounds,
                        position,
                        center,
                        googleCenter,
                        gmap,
                        mapOptions,
                        pacinput,
                        queryPlaces = {},
                        outerMapNumber = MapInstanceService.getSlideCount() - 1,
                        mlconfig = MapInstanceService.getConfigInstanceForMap(outerMapNumber),
                        service;

                    googmph = CurrentMapTypeService.getSpecificMapType('google');

                    mapLinkrBounds = mlconfig.getBounds();
                    searchBounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng({'lat' : mapLinkrBounds.lly, 'lng' : mapLinkrBounds.llx}),
                        new google.maps.LatLng({'lat' : mapLinkrBounds.ury, 'lng' : mapLinkrBounds.urx})
                    );
                    position = mlconfig.getPosition();
                    center = {'lat' : position.lat, 'lng' : position.lon};
                    googleCenter = new google.maps.LatLng(position.lat, position.lon);
                    gmap = googmph.getMap();
                    utils.showLoading();
                    if (!gmap) {
                        mapOptions = {
                            center : googleCenter,
                            zoom : 15,
                            mapTypeId : google.maps.MapTypeId.ROADMAP
                        };
                        gmap = new google.maps.Map(document.getElementById("hiddenmap_canvas"), mapOptions);
                    }

                    // placesFromSearch = searchBox.getPlaces();

                    pacinput = document.getElementById('pac-input');
                    queryPlaces.bounds = searchBounds;
                    queryPlaces.query = pacinput.value;
                    queryPlaces.location = center;
                    // MLConfig.setQuery(queryPlaces.query);

                    service = new google.maps.places.PlacesService(gmap);
                    if (queryPlaces.query !== '') {
                        service.textSearch(queryPlaces, placesQueryCallback);
                    }
                };

                function refreshMinMax() {
                    var minMaxText = document.getElementById("idMinMaxText"),
                        minMaxSymbol = document.getElementById("idMinMaxSymbol");
                    if (minMaxText && minMaxSymbol) {
                        minMaxText.innerHTML = SiteViewService.getSiteExpansion();
                        console.log("refresh MinMax Text with " + minMaxText.innerHTML);
                        minMaxSymbol.src = "../img/" + SiteViewService.getMinMaxSymbol() + ".png";
                        console.log("refresh MinMax Symbol with " + minMaxSymbol.src);
                    }
                }

                function placeCustomControls() {
                    function stopLintUnusedComplaints(lnkr, minmaxr) {
                        console.log("stopLintUnusedComplaints");
                    }
                    if (document.getElementById("linkerDirectiveId") === null) {

                        var contextScope = $scope,
                            curMapType = CurrentMapTypeService.getMapTypeKey(),
                            // whichCanvas = 'map' + mapStartup.getMapNumber() + '_root', // 'map_canvas_root';
                            whichCanvas = curMapType === 'arcgis' ? 'map' + mapStartup.getMapNumber() + '_root' : 'map' + mapStartup.getMapNumber(),
                            cnvs = utils.getElemById(whichCanvas),
                            templateLnkr = ' \
                                <div id="linkerDirectiveId" class="lnkrclass"> \
                                <label id="idLinkerText" class="lnkmaxcontrol_label lnkcontrol_margin"  \
                                style="cursor:url(../img/LinkerCursor.png) 9 9,auto;"> \
                                </label> \
                                <img id="idLinkerSymbol" class="lnkmaxcontrol_symbol lnkcontrol_margin" \
                                   style="cursor:url(../img/LinkerCursor.png) 9 9,auto;" > \
                                </div>',

                            templateMinMaxr = ' \
                                <div id="mapmaximizerDirectiveId" class="mnmxclass" > \
                                <label id="idMinMaxText" class="lnkmaxcontrol_label maxcontrol_margin" \
                                    style="cursor:url(../img/LinkerCursor.png) 9 9,auto;"> \
                                </label> \
                                <img id="idMinMaxSymbol" class="lnkmaxcontrol_symbol maxcontrol_margin" \
                                     style="cursor:url(../img/LinkerCursor.png) 9 9,auto;"> \
                                </div>',
                            lnkr1 = angular.element(templateLnkr),
                            lnkr = cnvs.append(lnkr1),

                            minmaxr1 = angular.element(templateMinMaxr),
                            minmaxr = cnvs.append(minmaxr1),

                            lnkrdiv,
                            mnmxdiv,
                            lnkrText,
                            lnkrSymbol,
                            refreshDelay;
                        stopLintUnusedComplaints(lnkr, minmaxr);

                        setTimeout(function () {
                            lnkrdiv = document.getElementsByClassName('lnkrclass')[0];
                            lnkrdiv.addEventListener('click', function (event) {
                                console.log('lnkr[0].onclick   display LinkerEvent');
                                event.stopPropagation();

                                LinkrSvc.showLinkr();
                            });
                            mnmxdiv = document.getElementsByClassName('mnmxclass')[0];

                            mnmxdiv.addEventListener('click', function (event) {
                                console.log('minmaxr[0].onclick   mapMaximizerEvent');
                                event.stopPropagation();
                                contextScope.$emit('mapMaximizerEvent');
                                contextScope.$apply();
                                refreshMinMax();
                            });
                        }, 200);


                        lnkrText = document.getElementById("idLinkerText");
                        lnkrSymbol = document.getElementById("idLinkerSymbol");
                        refreshDelay = 500;
                        if (lnkrSymbol && lnkrText) {
                            refreshDelay = 10;
                        }
                        setTimeout(function () {
                            refreshLinker();
                            refreshMinMax();
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

            }

        ]);

        function invalidateCurrentMapTypeConfigured() {
            console.log("invalidateCurrentMapTypeConfigured");
            if (selfMethods.invalidateCurrentMapTypeConfigured) {
                selfMethods.invalidateCurrentMapTypeConfigured();
            }
        }
        placeCustomControls = function () {
            console.log("placeCustomControls");
            selfMethods.placeCustomControls();
        }
        function setupQueryListener() {
            console.log("setupQueryListener");
            if (selfMethods.setupQueryListener) {
                selfMethods.setupQueryListener();
            }
        }
        return {
            invalidateCurrentMapTypeConfigured : invalidateCurrentMapTypeConfigured,
            placeCustomControls : placeCustomControls,
            setupQueryListener : setupQueryListener
        };
    });
// }());
}).call(this);
