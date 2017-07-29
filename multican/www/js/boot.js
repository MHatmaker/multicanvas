/*global require, define, console, angular, document, ionic, window, cordova, StatusBar, alert */

console.log("bootstrap outer wrapper");
(function () {
    "use strict";
    console.log("bootstrap setup method");
// requires routes, config, run they implicit requiring the app
    define([
        'libs/PusherConfig',
        'libs/HostConfig',
        'controllers/ControllerStarter',
        'controllers/WindowStarter'
    ], function (PusherConfig, HostConfig, ControllerStarter, WindowStarter) {
        function init(portalForSearch) {
            var modules = [],
                dependencies = ['ui.router', 'ionic', 'ui.bootstrap', 'ngAnimate', 'ui.grid', 'ui.grid.expandable',
                            'ui.grid.selection', 'ui.grid.pinning', 'ngResource', 'ngRoute'],
                isMobile = (ionic !== 'undefined') && (ionic.Platform.is("ios") || ionic.Platform.is("android")),
                localApp,
                app;

            if (isMobile) {
                dependencies.push('ngCordova');
            }
            // console.debug(dependencies.concat(modules));
            console.log("ready to create module mapModule");
            app = angular.module('mapModule', dependencies.concat(modules)).

                config(['$ionicConfigProvider', '$locationProvider',  '$urlRouterProvider', '$stateProvider', // '$compileProvider', '$routeProvider'
                    function ($ionicConfigProvider, $locationProvider,  $urlRouterProvider, $stateProvider) {  // $compileProvider, $routeProvider
                        // $locationProvider.html5Mode({
                        //     enabled: true,
                        //     requireBase: false
                        // }); // enable html5 mode
                        // other pieces of code.
                        // $ionicConfigProvider.views.maxCache(10);
                        $ionicConfigProvider.views.transition('platform');
                        // $ionicConfigProvider.views.forwardCache(false);
                        $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
                        $ionicConfigProvider.backButton.text('');                  // default is 'Back'
                        $ionicConfigProvider.backButton.previousTitleText(false);  // hides the 'Back' text
                        // $ionicConfigProvider.templates.maxPrefetch(20);

                        $stateProvider.
                            state('mapModule', {
                                url: "/mapModule",
                                abstract: true,
                                templateUrl: "templates/menu.html",
                                controller: 'SideMenuCtrl'
                            }).
                            state('mapModule.dashboard', {
                                url: '/dashboard',
                                views: {
                                    'menuContent' : {
                                        templateUrl: 'templates/dashboard.html',
                                        // controller: function ($stateParams) {
                                        //     var $inj = angular.element(document.body).injector(),
                                        //         canvasHolder = $inj.get('CanvasHolderCtrl');
                                        //     console.log("$stateParams : " + $stateParams.mapType);
                                        //     console.debug($stateParams);
                                        //     canvasHolder.addCanvas($stateParams.mapType);
                                        // }
                                        controller: 'MapCtrl'
                                    }
                                }
                            }).
                            state('mapModule.addmap', {
                                url: '/addmap/{mapType}',
                                // cache: false,
                                views: {
                                    'menuContent' : {
                                        templateUrl: 'templates/dashboard.html',
                                        controller: function ($scope, $rootScope, $stateParams) {
                                            // var $inj = angular.element(document.body).injector(),
                                            //     canvasHolder = $inj.get('CanvasHolderCtrl');
                                            console.debug($rootScope);
                                            console.log("$stateParams : " + $stateParams.mapType);
                                            console.debug($stateParams);
                                            // $rootScope.$broadcast('selectMapTypeEvent', {'mapType': $stateParams.mapType});
                                            // $scope.addNewMap = function (mapType) {
                                            //     alert("new map of type " + mapType);
                                            //     console.log("new map of type " + mapType);
                                            // }
                                        }
                                    }
                                }
                            }).
                            state('mapModule.search', {
                                url: '/search',
                                views: {
                                    'menuContent' : {
                                        templateUrl: 'templates/Search.html',
                                        controller: function ($scope, $state) {
                                            $scope.backToMaps = function ($scope) {
                                                $state.go("mapModule.dashboard");
                                            };
                                        }
                                    }
                                }
                            }).
                            state('mapModule.maplinkr', {
                                url: '/dashboard',
                                views: {
                                    'menuContent' : {
                                        templateUrl: 'templates/MapLinkrPlugin.html',
                                        controller: 'MapCtrl'
                                    }
                                }
                            });

                        $urlRouterProvider.otherwise("/mapModule/dashboard");
                    }]);
            app.directive('sideMenuClick', function () {
                return {
                    link: function ($scope, element) {
                        element.on('click', function () {
                            alert('click');
                        });
                    }
                };
            });
/*
            app.controller('SideMenuCtrl', function ($scope, $rootScope) { // ($scope) {
                console.log("Nothing happening in SideMenuCtrl yet");
                $scope.addNewMap = function (mapType) {
                    // alert("new map of type " + mapType);
                    console.log("new map of type " + mapType);
                    // $rootScope.$broadcast('selectMapTypeEvent', {'mapType': mapType});
                    var $inj = angular.element(document.body).injector(),
                        canvasHolder = $inj.get('CanvasHolderCtrl');
                    canvasHolder.addCanvas(mapType);
                }
            });
*/
            // ControllerStarter.start(mapModule, portalForSearch, isMobile);
            console.log('mapModule created ... wait for onload to bootstrap');
            ControllerStarter.start(app, portalForSearch, isMobile);
            angular.element(document).ready(function () {
                require([
                    'services/MapInstanceService',
                    'services/CurrentMapTypeService',
                    'services/MapControllerService',
                    'services/InjectorService',
                    'services/LinkrService',
                    'services/SiteViewService',
                    'services/GoogleQueryService',
                    'services/CanvasService',
                    'libs/PusherEventHandler',
                    'libs/StartupGoogle',
                    'libs/StartupArcGIS',
                    'libs/StartupLeaflet',
                    'libs/MapHosterGoogle',
                    'libs/MapHosterArcGIS',
                    'libs/MapHosterLeaflet',
                    'controllers/MapDirective'
                ]);
                console.log('ready to get localApp module for bootstrap');
                localApp = angular.module('mapModule');
                console.log('do we have a localApp to dump?');
                console.debug(localApp);
                console.log("now booooootstrap");
                angular.bootstrap(document, ['mapModule']);
                var $inj = angular.element(document.body).injector(),
                    $http = $inj.get('$http'),
                    hostConfig = HostConfig.getInstance(),
                    referrerId = hostConfig.getReferrerId(),
                    urlUserName;

                console.log("Check if referrerId is -99");
                if (referrerId === -99) {
                    hostConfig.getUserNameFromServer($http, {uname : true, uid : true, refId : referrerId === -99});
                } else {
                    urlUserName = hostConfig.getUserNameFromUrl();
                    // MLConfig.getReferrerIdFromUrl();
                    if (urlUserName) {
                        hostConfig.getUserName($http, {uname : false, uid : true, refId : referrerId === -99});
                    } else {
                        hostConfig.getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
                    }

                }
                PusherConfig.setInjector($inj);
                WindowStarter.getInstance().initializeHostEnvironment();
            });
            // window.onload = function () {
            //   console.log('ready to bootstrap');
            //   angular.bootstrap(document, ['app']);
            // }

            if (isMobile) {
                app.run(function ($ionicPlatform, $window) {
                    $ionicPlatform.ready(function () {
                        if ($window.cordova && $window.cordova.plugins.Keyboard) {
                            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                            // for form inputs)
                            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                            // Don't remove this line unless you know what you are doing. It stops the viewport
                            // from snapping when text inputs are focused. Ionic handles this internally for
                            // a much nicer keyboard experience.
                            $window.cordova.plugins.Keyboard.disableScroll(true);
                        }
                        if ($window.StatusBar) {
                            $window.StatusBar.styleDefault();
                        }
                    });
                });


            } else {
                app.run([
                    '$ionicPlatform',
                    function ($ionicPlatform) {
                        $ionicPlatform.ready(function () {
                            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                            // for form inputs)
                            if (window.cordova && window.cordova.plugins.Keyboard) {
                                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                                cordova.plugins.Keyboard.disableScroll(true);
                            }
                            if (window.StatusBar) {
                                // org.apache.cordova.statusbar required
                                StatusBar.styleDefault();
                            }
                        });
                    }
                ]);
            }
        }
        return {
            start : init
        };

    });

}());
