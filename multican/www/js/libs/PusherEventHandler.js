/*global define, console*/
(function () {
    'use strict';
    define([
    ], function () {

        console.log("ready to create PusherEventHandler");
        function PusherEventHandler(mapNo) {
            this.eventDct = {
                'client-MapXtntEvent' : null,
                'client-MapClickEvent' : null,
                'client-NewMapPosition' : null
            };
            this.mapNumber = mapNo;
        }

        PusherEventHandler.prototype.getEventDct = function () {
            return this.eventDct;
        };

        PusherEventHandler.prototype.addEvent = function (evt, handler) {
            this.eventDct[evt] = handler;
        };

        PusherEventHandler.prototype.getEventDct = function () {
            return this.eventDct;
        };

        PusherEventHandler.prototype.getMapNumber = function () {
            return this.mapNumber;
        };
        return {PusherEventHandler: PusherEventHandler}
    });
}());
