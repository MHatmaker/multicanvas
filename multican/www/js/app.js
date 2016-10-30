
define([
  'ionic',
  'services/MultiCanvas',
], function () {
  'use strict';

  // the app with its used plugins
  console.log("create module");
  var app = angular.module('app', [
    'ionic'
  ]);
  // return the app so you can require it in other components
  return app;
});
