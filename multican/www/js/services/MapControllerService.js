/*global require, define, console, document*/

define([
    'controllers/MapCtrl'
], function (MapCtrl) {
    'use strict';
    var
        app = angular.module('mapModule');

    console.log("ready to create MapControllerService");
    app.factory('MapControllerService', function () {
        var getController = function () {
            return MapCtrl;
        };
        return {getController : getController};
    });
  }
);
