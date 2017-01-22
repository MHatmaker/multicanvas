/*global require, console, angular, document*/

// requires routes, config, run they implicit requiring the app
require([
    'routes',
    'config',
    'run',
    'controllers/PusherSetupCtrl',
    'libs/PusherConfig',
    'controllers/MapCtrl',
    'controllers/CarouselCtrl',
    'controllers/CanvasHolderCtrl',
    'controllers/MapDirective'
    // 'js/libs/MLConfig',
    // 'esri.map',
    // 'esri.tasks.geometry',
    // 'esri.tasks.locator',
    // 'esri/geometry/webMercatorUtils',
    // 'esri.IdentityManager',
    // 'esri.dijit.Scalebar',
    // 'esri.arcgis.utils'
], function (routes, config, run, PusherSetupCtrl, PusherConfig) {
    'use strict';
    // Here you have to set your app name to bootstrap it manually
    console.log('wait for onload to bootstrap');
    PusherSetupCtrl.start(angular.module('app'));
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        var $inj = angular.element(document.body).injector();
        PusherConfig.PusherConfig().setInjector($inj);
    });
    // window.onload = function () {
    //   console.log('ready to bootstrap');
    //   angular.bootstrap(document, ['app']);
    // }
});
