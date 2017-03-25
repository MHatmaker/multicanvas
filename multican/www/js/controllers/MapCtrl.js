/*global define, require, console, google, document, window, navigator, alert*/

(function () {
    "use strict";

    console.log('MapCtrl setup');
    define([
        'app',
        'libs/StartupGoogle',
        'libs/StartupArcGIS',
        'libs/utils'
    ], function (app, StartupGoogle, StartupArcGIS, utils) {
        var selfMethods = {},
            curMapTypeInitialized = false,
            placeCustomControls;

        console.log("ready to create MapCtrl");
        app.controller('MapCtrl', [
            '$scope',
            '$compile',
            'MapInstanceService',
            function ($scope, $compile, MapInstanceService) {
                var outerMapNumber = MapInstanceService.getSlideCount(),
                    mapStartup;
                // var mapNumber = MapInstanceService.getSlideCount(),
                //     mapConfig = MapInstanceService.getConfigInstanceForMap(mapNumber),
                //     configMapNumber = mapConfig.getMapId();
                    // mapStartups = [];
                // console.log("In MapCtrl, Config Instance for map id is " + configMapNumber);
                $scope.mapheight = 450;
                $scope.mapwidth = 380;
                $scope.mapHosterInstance = null;

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
                        cnvs = utils.getElemById(whichCanvas),
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
                    if (curMapType === 'google') {
                        $scope.gsearch.isGoogle = true;
                    } else {
                        $scope.gsearch.isGoogle = false;
                        if (curMapType === 'arcgis') {
                            whichCanvas = 'map_canvas_root';
                            pacinputElement = document.getElementById('pac-input');
                            if (pacinputElement) {
                                pacinputParent = pacinputElement.parentElement;
                                pacinputParent.removeChild(pacinputElement);
                            }
                        }
                    }

                    whichCanvas = curMapType === 'arcgis' ? 'map_canvas_root' : 'map_canvas';
                    pacinput = document.getElementById('pac-input');
                    if (!pacinput) {
                        pacinput = angular.element(template);
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
                        mapStartup = new StartupGoogle.StartupGoogle(mapNumber);
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


                function placeCustomControls() {
                    console.log("MapCtrl.placeCustomControls");
                }
                selfMethods.placeCustomControls = placeCustomControls;

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
