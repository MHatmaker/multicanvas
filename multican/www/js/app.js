
define([
  'ionic',
  'services/MultiCanvas',
  'angularBootstrap'
], function () {
  'use strict';

  // the app with its used plugins
  console.log("create module");
  var app = angular.module('app', [
    'ionic',
    'ui.bootstrap'
  ]);
  // return the app so you can require it in other components
  return app;
});
