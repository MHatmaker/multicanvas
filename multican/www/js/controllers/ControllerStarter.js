/*global console, alert*/
/*global define */

(function () {
    "use strict";

    console.log('ControllerStarter setup');
    define([
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
        'libs/MLConfig'
    ],
        function (
            CanvasHolderCtrl, PositionViewCtrl, MapCtrl, MapLinkrPluginCtrl, MapLinkrMgrCtrl,
            SearcherCtrlGrp, SearcherCtrlMap, PusherSetupCtrl, PusherCtrl, DestWndSetupCtrl,
            TransmitNewUrlCtrl, ShareCtrl, PopupBlockerCtrl, LocateSelfCtrl, CarouselCtrl, SideMenuCtrl, GeoCoder, MLConfig
        ) {
            console.log('ControllerStarter define');

            function ControllerStarter($scope) {
                console.log("ControllerStarter empty block");
                console.debug($scope);
            }

            function getUserName($http, opts) {
                $http({method: 'GET', url: '/username'}).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available.
                        console.log('ControllerStarter getUserName: ', data.name);
                        // MLConfig.setUserId(data.id );
                        if (opts.uname) {
                            PusherConfig.setUserName(data.name);
                        }
                        // alert('got user name ' + data.name);
                        if (opts.uid) {
                            MLConfig.setUserId(data.id);
                        }
                        if (opts.refId === -99) {
                            MLConfig.setReferrerId(data.id);
                        }
                    }).
                    error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        console.log('Oops and error', data);
                        alert('Oops' + data.name);
                    });
            }

            function init(App, portalForSearch, isMobile) {
                console.log('ControllerStarter init');
                // var $inj = MLConfig.getInjector(),
                //     $http = $inj.get('$http'),
                //     referrerId = MLConfig.getReferrerId(),
                //     urlUserName;
                //
                // console.log("Check if referrerId is -99");
                // if (referrerId === -99) {
                //     getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
                // } else {
                //     urlUserName = MLConfig.getUserNameFromUrl();
                //     // MLConfig.getReferrerIdFromUrl();
                //     if (urlUserName) {
                //         getUserName($http, {uname : false, uid : true, refId : referrerId === -99});
                //     } else {
                //         getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
                //     }
                //
                // }

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
