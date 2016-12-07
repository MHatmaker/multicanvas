/*global console, define, document, MLConfig */

(function () {
    "use strict";

    console.log("MLConfig setup");
    define([],
        function () {
            console.log("entering MLConfig");

            function getParameterByName(name) {
                // console.log("get paramater " + name + " from " + details.search);
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(details.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
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
                        setInjector = function (inj) {
                            self.nginj = inj;
                        },
                        getInjector = function () {
                            return self.nginj;
                        },
                        webmapId = function (newWindow) {
                            return newWindow ? getParameterByName('id') : self.webmapId;
                        },
                        setWebmapId = function (id) {
                            self.webmapId = id;
                        },
                    return {
                        setMapId: setMapId,
                        getMapId: getMapId,
                        setMapHosterInstance: setMapHosterInstance,
                        getMapHosterInstance: getMapHosterInstance,
                        setInjector: setInjector,
                        getInjector: getInjector,
                        webmapid: webmapid,
                        setWebmapId: setWebmapId
                    };
                };

            return {
                MLConfig : MLConfig
            };

        });
// }).call(this);
}());
