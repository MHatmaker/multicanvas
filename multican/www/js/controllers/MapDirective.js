define([
    'app',
    'services/MapIntanceService'
], function(app) {
    'use strict';

    console.log("ready to create MapIntanceService");
  app.directive('mapdirective', ['$compile', 'services/MapIntanceService', function ($compile, mapInstanceService) {
    var mapId = "map" + mapInstanceService.getMapNumber();
    return {
      restrict : 'E',
      controller : 'MapCtrl',
      link : function(s, e, a) {
        var mapDiv = angular.element(
                  '<div ng-controller="MapCtrl" id="map' + mapInstance + '" style="width:400px;height:400px">' +
                    '<div data-tap-disabled="true" class="map"></div> ' +
                  '</div>');
        $compile(mapDiv)(s);
        e.append(mapDiv);
      }
    }
  });
});
