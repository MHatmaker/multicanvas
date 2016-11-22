/*global define, console*/

define([
    'app'
], function (app) {
    'use strict';

    console.log("ready to create MapIntanceService");
    var mapInstance = 0,
        isFirstInstance = true,
        configInstances = {},
        currentSlide = 0;
    app.service('MapInstanceService', [
        function () {
            console.log("service to return MapInstance");
            this.getMapNumber = function () {
                return mapInstance;
            };
            this.incrementMapNumber = function () {
                mapInstance += 1;
            };
            this.getNextMapNumber = function () {
                if (isFirstInstance) {
                    isFirstInstance = false;
                }
                return mapInstance;
            };
            this.removeInstance = function () {
                mapInstance -= 1;
            };
            this.addConfigInstanceForMap = function (ndx, cfg) {
                configInstances[ndx] = {
                    config: cfg
                };
            };
            this.addMapInstance = function (ndx, inst) {
                configInstances[ndx].mapInstance = inst;
            };
            this.getConfigInstanceForMap = function (ndx) {
                return configInstances[ndx].config;
            };
            this.setCurrentSlide = function (ndx) {
                currentSlide = ndx;
            };
            this.getCurrentSlide = function () {
                return currentSlide;
            };
            this.getMapInstance = function (ndx) {
                return configInstances[ndx].mapInstance;
            }
        }
    ]);
});
