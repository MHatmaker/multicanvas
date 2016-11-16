define([
    'app'
], function(app) {
    'use strict';

    console.log("ready to create MapIntanceService");
    var mapInstance = 0,
        isFirstInstance = true;
    app.service('MapInstanceService', [
        function() {
            console.log("service to return MapInstance");
            this.getMapNumber = function() {
                console.log("getMapNumber returning " + mapInstance);
                return mapInstance;
            };
            this.incrementMapNumber = function () {
              mapInstance++;
              console.log("mapInstance increment to " + mapInstance);
            }
          this.getNextMapNumber = function () {
              if (isFirstInstance ) {
                  console.log("getNextMapNumber first instance = true");
                  isFirstInstance = false;
                  return 0;
              } else {
                  console.log("getNextMapNumber subsequent instance");
                  return mapInstance;
              }
          }
        }
    ]);
});
