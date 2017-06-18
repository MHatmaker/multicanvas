/*global console, alert*/
/*global define */
/*jslint unparam: true*/

(function () {
    "use strict";

    console.log('ControllerStarter setup');
    define([
        'controllers/DestinationCtrl',
        'controllers/CanvasHolderCtrl',
        'controllers/PositionViewCtrl',
        'controllers/MapCtrl',
        'controllers/MapLinkrPluginCtrl',
        'controllers/MapLinkrMgrCtrl',
        'controllers/SearcherCtrlGrp',
        'controllers/SearcherCtrlMap',
        'controllers/PusherSetupCtrl',
        'controllers/PusherCtrl',
        'controllers/DestWndSetupCtrl',
        'controllers/TransmitNewUrlCtrl',
        'controllers/ShareCtrl',
        'controllers/PopupBlockerCtrl',
        'controllers/LocateSelfCtrl',
        'controllers/CarouselCtrl',
        'controllers/SideMenuCtrl',
        'libs/GeoCoder',
        'libs/PusherConfig'
    ],
        function (DestinationCtrl, CanvasHolderCtrl, PositionViewCtrl, MapCtrl, MapLinkrPluginCtrl, MapLinkrMgrCtrl,
            SearcherCtrlGrp, SearcherCtrlMap, PusherSetupCtrl, PusherCtrl, DestWndSetupCtrl,
            TransmitNewUrlCtrl, ShareCtrl, PopupBlockerCtrl, LocateSelfCtrl, CarouselCtrl, SideMenuCtrl, GeoCoder, PusherConfig
            ) {
            console.log('ControllerStarter define');

            function ControllerStarter($scope) {
                console.log("ControllerStarter empty block");
                console.debug($scope);
            }

            function init(App, portalForSearch, isMobile) {
                console.log('ControllerStarter init');

                DestinationCtrl.start();
                PositionViewCtrl.start();
                MapLinkrPluginCtrl.start();
                MapLinkrMgrCtrl.start();

                SearcherCtrlGrp.start(portalForSearch);
                SearcherCtrlMap.start(portalForSearch);

                PusherSetupCtrl.start();
                PusherCtrl.start();
                DestWndSetupCtrl.start();

                TransmitNewUrlCtrl.start();
                ShareCtrl.start();
                PopupBlockerCtrl.start();
                LocateSelfCtrl.start();

                MapCtrl.start(isMobile);
                CanvasHolderCtrl.start();
                CarouselCtrl.start();
                SideMenuCtrl.start();
                // GeoCoder.start(App, $http);


                return ControllerStarter;
            }

            return { start: init };

        });

}());
