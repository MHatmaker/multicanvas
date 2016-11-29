/*global console, define, document, MLConfig */

(function () {
    "use strict";

    console.log("MLConfig setup");
    define([],
        function () {
            console.log("entering MLConfig");
            var
                MLConfig = function (ndx) {
                    console.log("MLConfig ctor");
                    this.mapId = ndx;
                    this.mapHosterInstance = null;
                    console.log("mapId is set to " + this.mapId);
                };

            MLConfig.prototype.setMapId = function (id) {
                console.log("MLConfig setMapId to " + id);
                this.mapId = id;
                console.log("MapId is now " + this.mapId);
            };
            MLConfig.prototype.getMapId = function () {
                return this.mapId;
            };
            MLConfig.prototype.setMapHosterInstance = function (inst) {
                this.mapHosterInstance = inst;
                console.log("MLConfig.mapHosterInstance is set to " + this.mapHosterInstance.getMapNumber());
                console.debug(this.mapHosterInstance);
            };
            MLConfig.prototype.getMapHosterInstance = function () {
                console.log("MLConfig.mapHosterInstance is returning instance " + this.mapId);
                console.debug(this.mapHosterInstance);
                return this.mapHosterInstance;
            };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
