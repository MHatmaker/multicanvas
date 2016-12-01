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
                    var self = this,

                        setMapId = function (id) {
                            console.log("MLConfig setMapId to " + id);
                            self.mapId = id;
                            console.log("MapId is now " + self.mapId);
                        },
                        getMapId = function () {
                            return self.mapId;
                        },
                        setMapHosterInstance = function (inst) {
                            self.mapHosterInstance = inst;
                            console.log("MLConfig.mapHosterInstance is set to " + self.mapHosterInstance.getMapNumber());
                            console.debug(self.mapHosterInstance);
                        },
                        getMapHosterInstance = function () {
                            console.log("MLConfig.mapHosterInstance is returning instance " + self.mapId);
                            console.debug(self.mapHosterInstance);
                            return self.mapHosterInstance;
                        };
                    return {
                        setMapId: setMapId,
                        getMapId: getMapId,
                        setMapHosterInstance: setMapHosterInstance,
                        getMapHosterInstance: getMapHosterInstance
                    };
                };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
