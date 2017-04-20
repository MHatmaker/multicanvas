/*global define, angular, console, require, ionic*/

// define('angular', function () {
//     "use strict";
//     if (angular) {
//         return angular;
//     }
//     return {};
// });

define([
    // 'ionic',
    'angularBootstrap',
    'dojo/domReady!',
    'controllers/MapCtrl',
    'controllers/MapLinkrMgrCtrl'
], function (bs, dr, MapCtrlArg, MapLinkrMgrCtrlArg) {
    'use strict';

    // the app with its used plugins
    console.log("create module");
    var modules = [],
        dependencies = ['ui.router', 'ionic'],
        isMobile = typeof ionic !== 'undefined' && (ionic.Platform.is("ios") || ionic.Platform.is("android")),
        MapCtrl = MapCtrlArg,
        MapLinkrMgrCtrl = MapLinkrMgrCtrlArg,
        app;


    require(['services/MapInstanceService',
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
        'services/CanvasService',
        'controllers/MapLinkrMgrCtrl'
        ]);
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
        // require(['libs/MLConfig']);
        // return the app so you can require it in other components
    MapLinkrMgrCtrl.start();
    MapCtrl.start(app, isMobile);
    return app;
});
