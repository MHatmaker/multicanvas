/*global define, console*/

define([
    'app'
], function (app) {
    'use strict';

    console.log("ready to create MapInstanceService");
    var currentSlideNumberCount = 0,
        isFirstInstance = true,
        configInstances = {},
        currentSlideNumber = 0;
    app.service('MapInstanceService', [
        function () {
            console.log("service to return currentSlideNumberCount");
            this.getMapNumber = function () {
                return currentSlideNumberCount;
            };
            this.incrementMapNumber = function () {
                currentSlideNumberCount += 1;
            };
            this.getNextMapNumber = function () {
                if (isFirstInstance) {
                    isFirstInstance = false;
                }
                return currentSlideNumberCount;
            };
            this.removeInstance = function () {
                currentSlideNumberCount -= 1;
            };
            this.addConfigInstanceForMap = function (ndx, cfg) {
                configInstances[ndx] = {
                    config: cfg,
                    currentSlideNumber: ndx,
                    mapHosterInstance: null
                };
            };
            this.getConfigInstanceForMap = function (ndx) {
                return configInstances[ndx].config;
            };
            this.setCurrentSlide = function (ndx) {
                currentSlideNumber = ndx;
            };
            this.getCurrentSlide = function () {
                return currentSlideNumber;
            };
            this.getConfigCurrentSlideNumber = function (ndx) {
                return configInstances[ndx].currentSlideNumber;
            };
            this.setMapHosterInstance = function (ndx, inst) {
                configInstances[ndx].mapHosterInstance = inst;
            };
            this.getMapHosterInstance = function (ndx) {
                return configInstances[ndx].mapHosterInstance;
            };
        }
    ]);
});
