/*global console, define, document, MLConfig */

(function () {
    "use strict";

    define([],
        function () {
            console.log("entering MLConfig");
            var mapId;

            return {
                MLConfig : {
                    setMapId: function (id) {
                        mapId = id;
                    },
                    getMapId: function () {
                        return mapId;
                    },
                    ctor: function () {
                        console.log("MLConfig ctor");
                    }
                }
            };
        });
}());
