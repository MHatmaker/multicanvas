/*global require, console, angular, document*/

// requires routes, config, run they implicit requiring the app
require([
    'js/routes',
    'js/config',
    'js/run',
    'js/controllers/MapDirective',
    'js/controllers/CanvasHolderCtrl',
    'js/libs/MLConfig'
], function (routes, config, run, MapDirective, CanvasHolderCtrl, MLConfig) {
    'use strict';
    // Here you have to set your app name to bootstrap it manually
    console.log('wait for onload to bootstrap');
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        var $inj = angular.element(document.body).injector();
        MLConfig.setInjector($inj);
    });
    // window.onload = function () {
    //   console.log('ready to bootstrap');
    //   angular.bootstrap(document, ['app']);
    // }
});
