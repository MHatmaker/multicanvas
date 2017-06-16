/*global define */
/*global dojo, angular, console, window, setTimeout, document, alert, google */
/*jslint unparam: true*/
/*jslint browser: true*/

angular.isUndefinedOrNull = function (val) {
    "use strict";
    return angular.isUndefined(val) || val === null;
};

(function () {
    "use strict";

    console.log('SearcherCtrlMap setup');
    define([
        'libs/StartupArcGIS',
        'libs/utils',
        'libs/PusherConfig',
        'libs/MLConfig',
        'controllers/PusherSetupCtrl',
        'controllers/CarouselCtrl',
        "controllers/CanvasHolderCtrl",
        "controllers/DestinationCtrl",
        "controllers/WindowStarter"
    ], function (StartupArcGIS, utils, PusherConfig, MLConfig, PusherSetupCtrl, CarouselCtrl, CanvasHolderCtrl, DestinationCtrl, WindowStarter) {
        console.log('SearcherCtrlMap define');
        var scopeDict = {},
            portalForSearch = null;

        function SearcherCtrlMap($scope, $rootScope, MapInstanceService) {
            var self = this,
                selectedWebMapId = "Nada ID",
                // selectedWebMapTitle = "Nada Title",
                onAcceptDestination,
                pos;

            $scope.findMapDisabled = false;
            $scope.searchTermMap = "Chicago Crime";

            $scope.isMapAccPanelOpen = false;
            $scope.signInOutMap = "Sign In";
            scopeDict.rootScope = $rootScope;

            self.scope = $scope;

            $scope.destWindow = 'cancelMashOp';
            $scope.selectedItm = "Nada";

            // function stageStartNewCanvas(channel, clientName, destination, mph, newWindowId, query) {
            //     console.log('stageStartNewCanvas');
            //     var
            //         currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
            //         localMph = MapInstanceService.getMapHosterInstance(currentSlideNumber);
            //     WindowStarter.getInstance().openNewDisplay('arcgis', PusherConfig.masherChannel(false),
            //         PusherConfig.getUserName(), destination, localMph, newWindowId, query);
            // }

            onAcceptDestination = function (destWnd) {
                var
                    currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
                    nextSlideNumber = CarouselCtrl.getNextSlideNumber(),
                    mapInstance = MapInstanceService.getMapHosterInstance(currentSlideNumber),
                    configInstance = MapInstanceService.getConfigInstanceForMap(currentSlideNumber),
                    startupArcGIS,
                    mapHoster,
                    // mapLinkrBounds,
                    // configMapNumber,
                    centerCoord,
                    mapLocOptions,
                    mlconfig;

                console.log("onAcceptDestination " + destWnd.dstSel);
                if (destWnd.dstSel === 'Same Window') {
                    mlconfig = new MLConfig.MLConfig(currentSlideNumber);
                    MapInstanceService.setConfigInstanceForMap(currentSlideNumber, mlconfig);
                    startupArcGIS = new StartupArcGIS.StartupArcGIS(currentSlideNumber, mlconfig);
                    mlconfig.setPosition(configInstance.getPosition());
                    pos = mlconfig.getPosition();
                    centerCoord = { lat: pos.lat, lng: pos.lon};
                    mapLocOptions = {
                        center: centerCoord,
                        zoom: pos.zoom,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    startupArcGIS.configure(currentSlideNumber, mapLocOptions);
                    // configMapNumber = mlconfig.getMapId();
                    mapHoster = startupArcGIS.getMapHosterInstance(currentSlideNumber);
                    // startupArcGIS.setMapHosterInstance(mapHoster); // MapInstanceService.getMapHosterInstance(mapNumber));
                    MapInstanceService.setMapHosterInstance(currentSlideNumber, mapHoster);
                    // startupArcGIS.configure(); //currentSlideNumber, mapLocOptions);
                    // startupArcGIS.replaceWebMap(selectedWebMapId, destWnd, selectedWebMapTitle, mapInstance);
                } else if (destWnd.dstSel === "New Pop-up Window") {

                    if (PusherConfig.isNameChannelAccepted() === false) {
                        PusherSetupCtrl.getPusherChannel().then(function (response) {
                            console.log('SearcherCtrlMap getPusherChannel response is ' + response);
                            WindowStarter.getInstance().openNewDisplay('arcgis', PusherConfig.masherChannel(false),
                                PusherConfig.getUserName(), destWnd.dstSel, mapHoster, selectedWebMapId, '');
                        });
                    }
                } else {
                    CanvasHolderCtrl.addCanvas('arcgis', null);
                    // MapInstanceService.setConfigInstanceForMap(nextSlideNumber, mlconfig);
                    mlconfig = MapInstanceService.getConfigInstanceForMap(nextSlideNumber);
                }
                console.log("onAcceptDestination in SearcherCtrlMap with index " + currentSlideNumber);
                mlconfig.setPosition(MapInstanceService.getConfigInstanceForMap(currentSlideNumber === 0 ? currentSlideNumber : currentSlideNumber - 1).getPosition());
                mlconfig.webmapId = selectedWebMapId;
                if (destWnd.dstSel === 'Same Window') {
                    mapInstance.removeEventListeners();
                }
                // MapInstanceService.setConfigInstanceForMap(currentSlideNumber, mlconfig);
                // mapInstance.removeEventListeners();
                $scope.$parent.accept();

                console.log("onAcceptDestination " + destWnd.dstSel);
                // CanvasHolderCtrl.addCanvas('arcgis', mlconfig);
                // startupArcGIS = new StartupArcGIS.StartupArcGIS(currentSlideNumber, mlconfig);
                // .configure(); //currentSlideNumber, mapLocOptions);
                // startupArcGIS.replaceWebMap(selectedWebMapId, destWnd, selectedWebMapTitle, mapInstance);
            };

            // $scope.onDestinationWindowSelected = function (args) {
            //     var destWnd = args.dstWnd,
            //         $inj = PusherConfig.getInjector(),
            //         serv = $inj.get('CurrentMapTypeService'),
            //         selMph = serv.getSelectedMapType();
            //     console.log("onAcceptDestination " + destWnd);
            //     selMph.removeEventListeners();
            //
            //
            //     console.log("onDestinationWindowSelected " + destWnd);
            //     StartupArcGIS.replaceWebMap(selectedWebMapId,  destWnd, selectedWebMapTitle, selMph);
            // };

            $scope.selectWebMap = function (rowItem) {
                selectedWebMapId = rowItem.entity.id;
                // selectedWebMapTitle = rowItem.entity.title;
                $scope.openWindowSelectionDialog(
                    {
                        'id' : rowItem.entity.id,
                        'title' : rowItem.entity.title,
                        'snippet' : rowItem.entity.snippet,
                        'icon' : rowItem.entity.thumbnail,
                        'maptype' : 'arcgis'
                    }
                );
            };

            $scope.gridOptions = {
                // data: 'gridData',
                rowHeight: 50,
                expandableRowTemplate : '<div ui-grid="row.entity.subGridOptions" style="height: 100px; width: 100%;"></div>',

                expandableRowHeight: 95,

                //subGridVariable will be available in subGrid scope
                expandableRowScope: {
                    subGridVariable: 'subGridScopeVariable'
                },
                data : [],
                columnDefs: [
                    {
                        name : 'thumbnail',
                        field : 'thumbnail',
                        displayName : 'Img',
                        resizable : false,
                        width : 60,
                        // cellTemplate : '<img ng-src="{{row.getProperty(col.field)}}" width="50" height="50"/>'
                        cellTemplate: "<img width=\"50px\" ng-src=\"{{grid.getCellValue(row, col)}}\" lazy-src>"

                    },
                    {
                        name : ' ',
                        cellTemplate : '<div><button ng-click="grid.appScope.selectWebMap(row)">Select</button></div>',
                        width : 60
                    },
                    {
                        field : 'title',
                        name : 'title',
                        displayName : 'Map Title'
                    },
                    {
                        field : 'url',
                        name : 'url',
                        visible : false
                    },
                    {
                        field : 'snippet',
                        name : 'snippet',
                        visible : false
                    },
                    {
                        field : 'id',
                        name : 'id',
                        visible : false,
                        displayName : 'ID'
                    }

                ]
            };

            function transformResponse(results) {
                var trnsf = [],
                    rsp,
                    i,
                    mp,
                    mpsub,
                    limit = 20,
                    colDefs = [
                        {
                            field : 'snippet',
                            name : 'snippet',
                            displayName : 'Description'
                        },
                        {
                            field : 'owner',
                            name : 'owner',
                            visible : false
                        }
                    ];


                if (results.length < limit) {
                    limit = results.length;
                }
                for (i = 0; i < limit; i += 1) {
                    rsp = results[i];
                    mp = {};
                    mp.title = rsp.title;
                    mp.owner = rsp.owner;
                    mp.thumbnail = rsp.thumbnailUrl;
                    mp.url = rsp.itemUrl;
                    mp.id = rsp.id;
                    mp.snippet = rsp.snippet;

                    mp.subGridOptions = {};
                    mp.subGridOptions.columnDefs = colDefs;
                    mp.subGridOptions.data = [];
                    mpsub = {};
                    mpsub.snippet = rsp.snippet;
                    mpsub.id = rsp.id;
                    mpsub.owner = rsp.owner;
                    mp.subGridOptions.data.push(mpsub);

                    trnsf.push(mp);
                }
                return trnsf;
            }

            $scope.showMapResults = function (response) {
                var mpdata = [];
                console.log("showMapResults");
                console.debug(response);
                console.log("response.total " + response.total);

                if (response.total > 0) {
                    console.log("found array with length " + response.total);
                    mpdata = transformResponse(response.results);
                    $scope.gridOptions.columnDefs[1].visible = true;
                } else {
                    mpdata = [{
                        'id' : null,
                        'title' : "No matches",
                        'owner' : "bad egg",
                        'itemUrl' : "nada",
                        'thumbnailUrl' : "http://na.support.keysight.com/plts/help/WebHelp/images/td_icon_bad_data.gif",
                        'snippet' : "Your query returned no results from ArcGIS Online"
                    }];
                    $scope.gridOptions.columnDefs[1].visible = false;
                    mpdata = transformResponse(mpdata);
                }
                $scope.gridOptions.data = mpdata;
                setTimeout(function () {
                    $scope.safeApply(console.log(" $apply before loading grid"));
                }, 500);
                utils.hideLoading();
            };

            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
            };

            console.log("window width " + window.innerWidth);

            //  handleWindowResize() seems to have been the cause of inconsistent display/trashing of rows and columns.
            // setTimeout(function () {
            //      $scope.gridApi.grid.handleWindowResize();
            //      $scope.safeApply();
            //  }, 1000);

            $scope.safeApply = function (fn) {
                var phase;
                if (this.$root) {
                    phase = this.$root.$$phase;
                    if (phase === '$apply' || phase === '$digest') {
                        if (fn && (typeof fn === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                }
            };

            $scope.findArcGISGroupMaps = function () {
                utils.showLoading();
                var mf = document.getElementById('mapFinder'),
                    mfa = angular.element(mf),
                    keyword,
                    params = {};
                mfa.scope().safeApply();
                keyword = mf.value; // searchTermMap; //dojo.byId('mapFinder').value;
                params = {
                    q: ' type:"Web Map" -type:"Web Mapping Application" access:public ' + keyword,
                    num: 20
                };
                portalForSearch.queryItems(params).then(function (data) {
                    $scope.showMapResults(data);
                }, function (error) {  //error so reset sign in link
                    alert('error returning items' + error);
                });
            };


            // gets private groups as well
            $scope.signInFromMapTab = function () {
                console.log("signInFromMapTab");
                // self.portal = portalForSearch;

                if ($scope.signInOutMap.indexOf('In') !== -1) {
                    portalForSearch.signIn().then(function (loggedInUser) {
                        $scope.$emit('SignInOutEmitEvent'); //out
                        $scope.findArcGISGroupMaps(portalForSearch, $scope.searchTermMap);   // update results
                    }, function (error) {  //error so reset sign in link
                        $scope.$emit('SignInOutEmitEvent'); //in
                    });
                } else {
                    portalForSearch.signOut().then(function (portalInfo) {
                        $scope.$emit('SignInOutEmitEvent'); //in
                        $scope.findArcGISGroupMaps(portalForSearch, $scope.searchTermMap);
                    });
                }
            };

            $scope.$on('SignInOutBroadcastEvent', function (event, isSignedIn) {
                if (isSignedIn) {
                    $scope.signInOutMap = "Sign Out";
                } else {
                    $scope.signInOutMap = "Sign In";
                }
            });

            $rootScope.$on('OpenMapPaneCommand', function (event, args) {
                $scope.showMapResults(args.respData);
            });

            //display a list of groups that match the input user name



            // $scope.openWindowSelectionDialog = function (modal311, selectedWebMapId, selectedMapTitle) {
            $scope.openWindowSelectionDialog = function (info) {

                var
                    currentSlideNumber = CarouselCtrl.getCurrentSlideNumber(),
                    mapInstance = MapInstanceService.getMapHosterInstance(currentSlideNumber);
                if (mapInstance) {
                    mapInstance.removeEventListeners();
                }

                DestinationCtrl.getDestination(
                    {
                        'id' : info.id,
                        'title' : info.title,
                        'snippet' : info.snippet,
                        'icon' : info.icon,
                        'maptype' : info.maptype
                    }
                ).then(function (results) {
                    onAcceptDestination(results);
                }, function (error) {
                    console.log("error in getDestination " + error);
                });
            };
        }



        function init(portal) {
            console.log('SearcherCtrlMap init');
            var App = angular.module('mapModule');

            // App.service("CurrentWebMapIdService");

            App.controller('SearcherCtrlMap',  ['$scope', '$rootScope', 'MapInstanceService',  SearcherCtrlMap]);

            portalForSearch = portal;
            return SearcherCtrlMap;
        }

        return { start: init };

    });
}());
