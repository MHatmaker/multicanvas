/*global define, angular, console, require*/

// define('angular', function () {
//     "use strict";
//     if (angular) {
//         return angular;
//     }
//     return {};
// });

define([
    // 'ionic',
    'angularBootstrap',
    'dojo/domReady!'
], function () {
    'use strict';

    // the app with its used plugins
    console.log("create module");
    var app = angular.module('app', [
        'ionic',
        'ui.bootstrap'
    ]);
    console.log("ready to create MapDirective");
    require(['services/MapInstanceService',
        'services/PusherEventHandlerService',
        'services/CurrentMapTypeService',
        'services/MapControllerService',
        'libs/StartupGoogle',
        'libs/StartupArcGIS',
        'libs/MapHosterGoogle',
        'libs/MapHosterArcGIS',
        'services/CanvasService'
    ]);
        // require(['libs/MLConfig']);
        // return the app so you can require it in other components
    return app;
});
