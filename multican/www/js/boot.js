// requires routes, config, run they implicit requiring the app
require([
  'routes',
  'config',
  'run',
  'controllers/CanvasHolderCtrl',
], function () {
  'use strict';
  // Here you have to set your app name to bootstrap it manually
  console.log('wait for onload to bootstrap');
  angular.bootstrap(document, ['app']);
  // window.onload = function () {
  //   console.log('ready to bootstrap');
  //   angular.bootstrap(document, ['app']);
  // }
});
