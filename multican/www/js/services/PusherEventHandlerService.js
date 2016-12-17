/*global define, console*/

define([
    'app'
], function (app) {
    'use strict';

    console.log("ready to create PusherEventHandlerService");
    var
        eventDct = {
            'client-MapXtntEvent' : null,
            'client-MapClickEvent' : null,
            'client-NewMapPosition' : null
        };
    app.service("PusherEventHandlerService", [
        function () {
            this.getEventDct = function () {
                return eventDct;
            };

            this.addEvent = function (evt, handler) {
                eventDct[evt] = handler;
            };

            this.getHandler = function (evt) {
                return eventDct[evt];
            };
        }
    ]);
});
