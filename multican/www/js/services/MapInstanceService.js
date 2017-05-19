/*global define, console, angular*/

define([
], function () {
    'use strict';

    console.log("ready to create MapInstanceService");
    var slideCount = 0,
        isFirstInstance = true,
        currentSlideNumber = 0,
        app = angular.module('mapModule');
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
            this.removeInstance = function (slideToRemove) {
                if (slideToRemove === slideCount - 1) {
                    slideCount -= 1;
                }
            };
            this.addConfigInstanceForMap = function (ndx, cfg) {
                configInstances["cfg" + ndx] = cfg;
            };
            this.getConfigInstanceForMap = function (ndx) {
                return configInstances["cfg" + ndx];
            };
            this.hasConfigInstanceForMap = function (ndx) {
                var instname = 'cfg' + ndx,
                    test = configInstances[instname] === null;
                console.log('hasConfigInstanceForMap for ' + instname);
                console.log("test " + test);

                return (configInstances['cfg' + ndx]) ? true : false;
            };
            this.setCurrentSlide = function (ndx) {
                currentSlideNumber = ndx;
            };
            this.getCurrentSlide = function () {
                return currentSlideNumber;
            };
            this.getConfigForMap = function (ndx) {
                return configInstances["cfg" + ndx];
            };
            this.setMapHosterInstance = function (ndx, inst) {
                var cfgndx = "cfg" + ndx;
                configInstances[cfgndx].setMapHosterInstance(inst);
                // this.incrementMapNumber();
            };
            this.getMapHosterInstance = function (ndx) {
                return configInstances["cfg" + ndx].getMapHosterInstance();
            };
            this.getMapHosterInstanceForCurrentSlide = function () {
                return this.getMapHosterInstance(currentSlideNumber);
            };
        }
    ]);
});
