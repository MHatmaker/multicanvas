/*global require, define, console, angular, document, ionic*/

console.log("bootstrap outer wrapper");
(function () {
    "use strict";
    console.log("bootstrap setup method");
// requires routes, config, run they implicit requiring the app
    define([
        'libs/PusherConfig'
    ], function (PusherConfig) {
        function init(portalForSearch) {
            var modules = [],
                dependencies = ['ui.router', 'ionic', 'ngRoute', 'ui.bootstrap', 'ngTouch', 'ngAnimate', 'ui.grid', 'ui.grid.expandable',
                            'ui.grid.selection', 'ui.grid.pinning', 'ngResource'],
                isMobile = (ionic !== 'undefined') && (ionic.Platform.is("ios") || ionic.Platform.is("android")),
                localApp,
                app;

            if (isMobile) {
                dependencies.push('ngCordova');
            }
            app = angular.module('app', dependencies.concat(modules))

                .config(['$locationProvider', '$compileProvider', '$urlRouterProvider', '$stateProvider',
                    function ($locationProvider, $compileProvider, $urlRouterProvider, $stateProvider) {
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
            console.log('wait for onload to bootstrap');
            //  PusherSetupCtrl.getInstance().start(angular.module('app'));
            // MapLinkrMgrCtrl.start();
            angular.element(document).ready(function () {
                localApp = angular.module('app');
                console.debug(localApp);
                angular.bootstrap(document.body, ['app']);
                var $inj = angular.element(document.body).injector();
                PusherConfig.getInstance().setInjector($inj);
            });
            require([
                'js/boot',
                'services/MapInstanceService',
                'services/PusherEventHandlerService',
                'services/CurrentMapTypeService',
                'services/MapControllerService',
                'services/InjectorService',
                'services/LinkrService',
                'services/SiteViewService',
                'services/GoogleQueryService',
                'libs/StartupGoogle',
                'libs/StartupArcGIS',
                'libs/StartupLeaflet',
                'libs/MapHosterGoogle',
                'libs/MapHosterArcGIS',
                'libs/MapHosterLeaflet',
                'services/CanvasService'
            ]);
            // window.onload = function () {
            //   console.log('ready to bootstrap');
            //   angular.bootstrap(document, ['app']);
            // }
            return {
                start : init
            };
        }
        return {
            start : init
        };

    });

}());
