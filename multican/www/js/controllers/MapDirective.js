/*global define, console, angular*/

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/

define([
    'services/MapInstanceService',
    'controllers/MapCtrl'
], function () {
    'use strict';
    var app = angular.module('mapModule');

    console.log("ready to create MapDirective");
    app.directive('mapdirective', ['$compile', 'MapInstanceService', function ($compile, mapInstanceService) {
        return {
            restrict: 'E',
            controller: 'MapCtrl',
            link: function (s, e) {
                console.log("new mapdirective for map with id " + mapInstanceService.getNextMapNumber());
                var mapInstance = "map" + mapInstanceService.getNextMapNumber(),
                    mapDiv = angular.element(
                        '<div ng-controller="MapCtrl" class="MapHolder" style="height: {{mapheight}}px; width: {{mapwidth}}%;" id=' + mapInstance + '>' +
                            '<div data-tap-disabled="true"></div> ' +
                            '</div>'
                    );
                $compile(mapDiv)(s);
                e.append(mapDiv);
            }
        };
    }]);
});
