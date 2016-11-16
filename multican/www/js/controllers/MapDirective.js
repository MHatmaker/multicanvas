/*global define, console, angular*/

define([
    'app',
    'services/MapInstanceService'
], function (app) {
    'use strict';

    console.log("ready to create MapDirective");
    app.directive('mapdirective', ['$compile', 'MapInstanceService', function ($compile, mapInstanceService) {
        return {
            restrict : 'E',
            controller : 'MapCtrl',
            link : function (s, e) {
                var mapInstance = "map" + mapInstanceService.getNextMapNumber();
                console.log("new mapdirective for map with id " + mapInstance);
                var mapDiv = angular.element(
                        '<div ng-controller="MapCtrl" style="width: 480px; height: 480px;" id=' + mapInstance + '>' +
                            '<div data-tap-disabled="true" style="width: 480px; height: 480px;" class="map"></div> ' +
                            '</div>'
                    );
                $compile(mapDiv)(s);
                e.append(mapDiv);
            }
        };
    }]);
});
