/*global define, console*/

define([
    'app'
], function (app) {
    'use strict';

    console.log("ready to create MapInstanceService");
    var slideCount = 0,
        isFirstInstance = true,
        currentSlideNumber = 0;
    app.service('MapInstanceService', [
        function () {
            var configInstances = {};
            console.log("service to return slideCount");
            this.getSlideCount = function () {
                return slideCount;
            };
            this.incrementMapNumber = function () {
                slideCount += 1;
            };
            this.getNextMapNumber = function () {
                if (isFirstInstance) {
                    isFirstInstance = false;
                }
                return slideCount;
            };
            this.removeInstance = function () {
                slideCount -= 1;
            };
            this.addConfigInstanceForMap = function (ndx, cfg) {
                configInstances["cfg" + ndx] = cfg;
            };
            this.getConfigInstanceForMap = function (ndx) {
                return configInstances["cfg" + ndx];
            };
            this.setCurrentSlide = function (ndx) {
                currentSlideNumber = ndx;
            };
            this.getCurrentSlide = function () {
                return currentSlideNumber;
            };
            this.getConfigCurrentSlideNumber = function (ndx) {
                return configInstances["cfg" + ndx].currentSlideNumber;
            };
            this.setMapHosterInstance = function (ndx, inst) {
                configInstances["cfg" + ndx].setMapHosterInstance(inst);
            };
            this.getMapHosterInstance = function (ndx) {
                return configInstances["cfg" + ndx].getMapHosterInstance();
            };
        }
    ]);
});
