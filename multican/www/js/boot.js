/*global require, define, console, angular, document, ionic, window, cordova, StatusBar */

console.log("bootstrap outer wrapper");
(function () {
    "use strict";
    console.log("bootstrap setup method");
// requires routes, config, run they implicit requiring the app
    define([
        'libs/PusherConfig',
        'controllers/ControllerStarter'
    ], function (PusherConfig, ControllerStarter) {
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
            console.debug(dependencies.concat(modules));
            console.log("ready to create module mapModule");
            app = angular.module('mapModule', dependencies.concat(modules))

                .config(['$locationProvider',  '$urlRouterProvider', '$stateProvider', // '$compileProvider', '$routeProvider'
                    function ($locationProvider,  $urlRouterProvider, $stateProvider) {  // $compileProvider, $routeProvider
                        $locationProvider.html5Mode({
                            enabled: true,
                            requireBase: false
                        }); // enable html5 mode
                        // other pieces of code.
                        $stateProvider.
                            state('app', {
                                url: "/app",
                                abstract: true,
                                templateUrl: "menu.html",
                                controller: 'AppCtrl'
                            }).
                            state('app.dashboard', {
                                url: '/dashboard',
                                templateUrl: 'templates/dashboard.html',
                                controller: 'MapCtrl'
                            }).
                            state('app.maplinkr', {
                                url: '/dashboard',
                                templateUrl: 'templates/MapLinkrPlugin.html',
                                controller: 'MapCtrl'
                            });

                        $urlRouterProvider.otherwise("/app/dashboard");
                    }]);
            app.controller('AppCtrl', function () { // ($scope) {
                console.log("Nothing happening in AppCtrl yet");
            });

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
                localApp = angular.module('mapModule');
                console.debug(localApp);
                angular.bootstrap(document, ['mapModule']);
                var $inj = angular.element(document.body).injector();
                PusherConfig.setInjector($inj);
            });
            // window.onload = function () {
            //   console.log('ready to bootstrap');
            //   angular.bootstrap(document, ['app']);
            // }


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
        return {
            start : init
        };

    });

}());
