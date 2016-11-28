/*global console, define, document, MLConfig */

(function () {
    "use strict";

    console.log("MLConfig setup");
    define([],
        function () {
            console.log("entering MLConfig");
            var mapId,
                mapHosterInstance,
                MLConfig = function (ndx) {
                    console.log("MLConfig ctor");
                    mapId = ndx;
                    console.log("mapId is set to " + mapId);
                };

            MLConfig.prototype.setMapId = function (id) {
                console.log("MLConfig setMapId to " + id);
                mapId = id;
                console.log("MapId is now " + mapId);
            };
            MLConfig.prototype.getMapId = function () {
                return mapId;
            };
            MLConfig.prototype.setMapHosterInstance = function (inst) {
                mapHosterInstance = inst;
                console.log("MLConfig.mapHosterInstance is set to " + mapHosterInstance.getMapNumber());
                console.debug(mapHosterInstance);
            };
            MLConfig.prototype.getMapHosterInstance = function () {
                console.log("MLConfig.mapHosterInstance is returning instance " + mapId);
                console.debug(mapHosterInstance);
                return mapHosterInstance;
            };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
