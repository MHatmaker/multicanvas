/*global define, angular, console, require, ionic*/

// define('angular', function () {
//     "use strict";
//     if (angular) {
//         return angular;
//     }
//     return {};
// });

require([
    // 'ionic',
    'angularBootstrap',
    'dojo',
    'dojo/domReady',
    'esri/arcgis/Portal',
    'js/boot'
], function (bs,dojo, dojodomReady, esriPortal, boot) {
    'use strict';

    dojodomReady(function () {
        var
            portalUrl = document.location.protocol + '//www.arcgis.com',
            portalForSearch = new esri.arcgis.Portal(portalUrl);
        console.info('start the bootstrapper');
        boot.start(portalForSearch);
    });
});
