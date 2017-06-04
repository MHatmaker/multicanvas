/*global define*/

define([
    'app',
    // Load Controllers here
    'controllers/dashboard'
], function (app) {
    'use strict';
    // definition of routes
    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // url routes/states
            $urlRouterProvider.otherwise('dashboard');

            $stateProvider
            // app states
                .state('app', {
                  url: "/",
                  abstract: true,
                  templateUrl: "menu.html",
                  controller: 'SideMenuCtrl'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'templates/dashboard.html',
                    controller: 'DashboardCtrl'
                });
        }
    ]);
});
