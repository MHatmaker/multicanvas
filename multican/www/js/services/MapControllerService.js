/*global require, define, console, document*/

// require(['libs/MultiCanvas']);

define([
    'app',
    'controllers/MapCtrl'
], function (app, MapCtrl) {
    'use strict';

    console.log("ready to create MapControllerService");
    app.factory('MapControllerService', function () {
        var getController = function () {
            return MapCtrl;
        };
        return {getController : getController};
    });
  }
);