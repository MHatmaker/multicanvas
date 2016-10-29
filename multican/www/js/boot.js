// requires routes, config, run they implicit requiring the app
require([
  'routes',
  'config',
  'run',
  'app'
], function () {
  'use strict';
  // Here you have to set your app name to bootstrap it manually
  console.log('ready to bootstrap');
  angular.bootstrap(document, ['app']);
});
