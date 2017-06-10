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
    'esri/config',
    'esri/Color',
    'esri/map',
    'js/boot',
    'js/libs/HostConfig'
], function (bs,dojo, dojodomReady, esriPortal, esriconfig, esricolor, esrimap, boot, HostConfig) {
    'use strict';
    var locationPath = "/",
        hostConfig = HostConfig.HostConfig();

    console.log('HostConfig initialization');
    hostConfig.showConfigDetails('MapLinkr App startup before modifying default settings and dojodomReady');

    hostConfig.setLocationPath(location.origin + location.pathname);
    hostConfig.setSearch(location.search);
    hostConfig.setprotocol(location.protocol);
    hostConfig.sethost(location.host);
    hostConfig.sethostport(location.port);
    hostConfig.sethref(location.href);

    if (location.search === '') {
        hostConfig.setInitialUserStatus(true);
        hostConfig.setReferrerId(-99);
    } else {
        hostConfig.setInitialUserStatus(false);
        channel = hostConfig.getChannelFromUrl();
        if (channel !== '') {
            hostConfig.setChannel(channel);
            hostConfig.setNameChannelAccepted(true);
        }
        hostConfig.setStartupView(true, false);
        console.log("hostConfig.SETSTARTUPVIEW to sumvis true, sitevis false");
    }

    console.log("is Initial User ? " + hostConfig.getInitialUserStatus());

    hostConfig.showConfigDetails('MasherApp startup after modifying default settings');

    dojodomReady(function () {
        var
            portalUrl = document.location.protocol + '//www.arcgis.com',
            portalForSearch = new esri.arcgis.Portal(portalUrl);
        console.info('start the bootstrapper');
        boot.start(portalForSearch);
    });
});
