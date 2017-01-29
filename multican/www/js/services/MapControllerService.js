/*global require, define, console, document*/

// require(['libs/MultiCanvas']);

define([
    'app',
    'controllers/MapCtrl'
], function (app, MapCtrl) {
    'use strict';

    console.log("ready to create MapControllerService");
    app.service('MapControllerService', [
        function () {
            this.getController = function () {
                return MapCtrl;
            }
        }
    ]);
});
