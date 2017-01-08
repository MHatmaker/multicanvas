/*global define, console*/

define([
    'app'
], function (app) {
    'use strict';

    console.log("ready to create DashboardCtrl");
    app.controller('DashboardCtrl', [
        '$scope',
        function ($scope) {
            console.log("DashboardCtrl no longer calling into myService");
        }
    ]);
});
