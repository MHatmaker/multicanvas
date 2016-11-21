/*global console, define, document, MLConfig */

(function () {
    "use strict";

    console.log("MLConfig setup");
    define([],
        function () {
            console.log("entering MLConfig");
            var mapId,
                MLConfig = function () {
                    console.log("empty MLConfig ctor");
                };

            MLConfig.prototype.setMapId = function (id) {
                console.log("MLConfig setMapId to " + id)
                mapId = id;
                console.log("MapId is now " + mapId);
            };
            MLConfig.prototype.getMapId = function () {
                return mapId;
            };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
