/*global define, console, angular*/
/*jslint es5: true*/

define(
    [
        'app'
    ],
    function (app) {
        'use strict';

        console.log("ready to create InjectorService");

        app.factory("InjectorSvc", function () {
            var injector = angular.injector(['app']),
                getInjector = function () {
                    return injector;
                };
            return {
                getInjector : getInjector
            };
        });
    }
);