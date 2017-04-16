/*global require, console, angular, document*/

// requires routes, config, run they implicit requiring the app
require([
    'routes',
    'config',
    'run',
    'libs/PusherConfig',
    'controllers/PusherSetupCtrl',
    'controllers/MapLinkrMgrCtrl',
    'controllers/MapCtrl',
    'controllers/CarouselCtrl',
    'controllers/CanvasHolderCtrl',
    'controllers/MapDirective',
    // 'js/libs/MLConfig',
    // 'esri',
    // 'esri/map',
    // 'esri/tasks/GeometryService',
    // 'esri/tasks/locator'
    // 'proj4'
    // 'esri/geometry/webMercatorUtils',
    // 'esri/IdentityManager',
    // 'esri/dijit/Scalebar',
    // 'esri/arcgis/utils'
], function (routes, config, run, PusherConfig, PusherSetupCtrl, MapLinkrMgrCtrl) {
    'use strict';
    // Here you have to set your app name to bootstrap it manually
    console.log('wait for onload to bootstrap');
    PusherSetupCtrl.start(angular.module('app'));
    // MapLinkrMgrCtrl.start();
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        var $inj = angular.element(document.body).injector();
        PusherConfig.getInstance().setInjector($inj);
    });
    // window.onload = function () {
    //   console.log('ready to bootstrap');
    //   angular.bootstrap(document, ['app']);
    // }
});
