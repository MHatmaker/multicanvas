define([
  'app',
  'services/service'
], function (app) {
  'use strict';

  app.controller('DashboardCtrl', [
    '$scope',
    'myService',
    function ($scope, myService) {
      console.log("DashboardCtrl calling into myService");
      $scope.name = myService.getName();
    }
  ]);
});
