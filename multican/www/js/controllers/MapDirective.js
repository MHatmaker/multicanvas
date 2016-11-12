/*global define, console, angular*/

define([
    'app',
    'services/MapInstanceService',
], function (app) {
    'use strict';

    console.log("ready to create MapDirective");
    app.directive('mapdirective', ['$compile', 'MapInstanceService', function ($compile, mapInstanceService) {
        var mapInstance = "map" + mapInstanceService.getMapNumber();
        return {
            restrict : 'E',
            controller : 'MapCtrl',
            link : function (s, e) {
                var mapDiv = angular.element(
                        '<div ng-controller="MapCtrl" id="map' + mapInstance + '" style="width:400px;height:400px">' +
                            '<div data-tap-disabled="true" class="map"></div> ' +
                            '</div>'
                    );
                $compile(mapDiv)(s);
                e.append(mapDiv);
            }
        };
    }
  ]);
});
