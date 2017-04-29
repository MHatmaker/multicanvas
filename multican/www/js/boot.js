/*global require, define, console, angular, document, ionic*/

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

                .config(['$routeProvider', '$locationProvider',  '$urlRouterProvider', '$stateProvider', // '$compileProvider',
                    function ($routeProvider, $locationProvider,  $urlRouterProvider, $stateProvider) {  // $compileProvider,
                        $locationProvider.html5Mode({
                            enabled: true,
                            requireBase: false
                        }); // enable html5 mode
                        // other pieces of code.
                        $stateProvider.state('map', {
                            url: '/',
                            templateUrl: 'templates/dashboard.html',
                            controller: 'MapCtrl'
                        });

                        $urlRouterProvider.otherwise("/");
                    }
                    ]);

            // ControllerStarter.start(mapModule, portalForSearch, isMobile);
            console.log('mapModule created ... wait for onload to bootstrap');
            //  PusherSetupCtrl.getInstance().start(angular.module('app'));
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
                PusherConfig.getInstance().setInjector($inj);
            });
            // window.onload = function () {
            //   console.log('ready to bootstrap');
            //   angular.bootstrap(document, ['app']);
            // }
        }
        return {
            start : init
        };

    });

}());
