define([
    'app'
], function(app) {
    'use strict';

    console.log("ready to create MapIntanceService");
    var mapInstance = 0;
    app.service('MapInstanceService', [
        function() {
            console.log("service to return MapInstance");
            this.getMapNumber = function() {
                return mapInstance;
            };
            this.incrementMapNumber = function () {
              mapInstance++;
            }
        }
    ]);
});
