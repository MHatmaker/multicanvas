
  define('angular', function () {
      if (angular) {
          return angular;
      }
      return {};
  });
  
define([
  'ionic',
  'services/MultiCanvas',
  'angularBootstrap'
], function () {
  'use strict';

  // the app with its used plugins
  console.log("create module");
  var app = angular.module('app', [
    'ionic',
    'ui.bootstrap'
  ]);
  console.log("ready to create MapDirective");
  require(['services/MapInstanceService']);
  app.directive('mapdirective', ['$compile', 'MapInstanceService', function ($compile, mapInstanceService) {
      var mapInstance = "map" + mapInstanceService.getMapNumber();
      return {
          restrict : 'E',
          controller : 'MapCtrl',
          link : function (s, e) {
              console.log("in mapdirective link function");
              var mapInstance = "map" + mapInstanceService.getMapNumber(),
                  mapDiv = angular.element(
                      '<div ng-controller="MapCtrl" id="' + mapInstance + '" class="map_canvas">' +
                          '<div data-tap-disabled="true" class="map"></div> ' +
                          '</div>'
                  );
              $compile(mapDiv)(s);
              e.append(mapDiv);
          }
      };
  }]);

  // return the app so you can require it in other components
  return app;
});
