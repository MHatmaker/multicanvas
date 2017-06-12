/*global require, define, console, angular, document, alert, window*/
/*jslint es5: true */

(function () {
    "use strict";
    console.log("ready to require stuff in WindowStarter");
    require(["libs/utils"]);

    define([
        'libs/utils',
        'libs/MLConfig',
        'libs/HostConfig',
        'libs/PusherConfig',
        'controllers/PopupBlockerCtrl'
    ], function (utils, MLConfig, HostConfig, PusherConfig) {

        var instance = null,

            setHostEnvironment = function () {
                return new Promise(function (resolve, reject) {
                    var
                        $inj = angular.element(document.body).injector(),
                        $http = $inj.get('$http'),
                        pusherPath = PusherConfig.getPusherPath() + "/hostenvironment";

                    console.log("WindowStarter.setHostEnvironment with pusher path " + pusherPath);
                    $http({method: 'GET', url: pusherPath}).
                        success(function (data, status, headers, config) {
                            HostConfig.HostConfig().sethost(data.host);
                            HostConfig.HostConfig().sethostport(data.port);
                            resolve();
                        }).
                        error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            console.log('Oops and environment error', data);
                            alert('Oops getting host environment');
                            reject();
                        });
                    });
            },

            setupNewDisplay = function (channel, userName, wndIndex, destWnd, curmph, newSelectedWebMapId, query) {
                var
                    wndName = newSelectedWebMapId + wndIndex,
                    baseUrl,
                    displayBnds,
                    popresult,
                    modalInstance,
                    $inj,
                    $uibModal,
                    restUrl,
                    mlconfig = curmph.getMLConfig(),
                    urlToUnblock = HostConfig.HostConfig().gethost(), //'OpenShift.Arcadian.com',
                    url = "?id=" + wndName + curmph.getGlobalsForUrl() +
                    "&channel=" + channel + "&userName=" + userName +
                    "&maphost=google" + "&referrerId=" + mlconfig.getUserId(),
                    gmQuery = query; //MLConfig.getQuery();

                if (gmQuery !== '') {
                    url += "&gmquery=" + gmQuery;
                    displayBnds = mlconfig.getBoundsForUrl();
                    url += displayBnds;
                }
                console.log("open new Google window with URI " + url);
                console.log("using channel " + channel + "with userName " + userName);
                mlconfig.setUrl(url);
                PusherConfig.setUserName(userName);

                if (destWnd === "New Pop-up Window") {
                    baseUrl = HostConfig.HostConfig().getbaseurl();

                    popresult = window.open(baseUrl + "/google/" + url,  wndName, mlconfig.getSmallFormDimensions());
                    if (popresult === null) {
                        $inj = angular.element(document.body).injector();
                        $uibModal = $inj.get('$uibModal');

                        modalInstance = $uibModal.open({

                            templateUrl : '/templates/ModalDialogPopupBlocked',   // .jade will be appended
                            controller : 'PopupBlockerCtrl',
                            backdrop : 'false',

                            resolve: {
                                data : function () {
                                    return {'urlToUnblock': urlToUnblock};
                                }
                            }
                        });

                        modalInstance.result.then(function (msg) {
                            console.log("return from showing PopupBlockerDialog dialog");
                        });
                    }

                } else {
                    if (destWnd === "New Tab") {
                        baseUrl = HostConfig.HostConfig().getbaseurl();
                        restUrl = $inj.get('CurrentMapTypeService').getMapRestUrlForType('google');
                        window.open(baseUrl + restUrl + url, '_blank');
                        window.focus();
                    }
                }
            },

            openNewDisplay = function (channel, userName, destWnd, curmph, newSelectedWebMapId, query) {
                var $inj = angular.element(document.body).injector(),
                    $http = $inj.get('$http'),
                    path = PusherConfig.getPusherPath() + "/wndseqno";

                $http({method: 'GET', url: path}).
                    success(function (data, status, headers, config) {
                        setupNewDisplay(channel, userName, data.wndNameSeqNo, destWnd, curmph, newSelectedWebMapId, query);
                    }).
                    error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        console.log('Oops and error', data);
                        alert('Oops getting next window sequence number');
                    });
            };

        function init() {
            return {openNewDisplay : openNewDisplay};
        }
        function initializeHostEnvironment() {
            setHostEnvironment().then( function (response) {
                return {openNewDisplay : openNewDisplay};
            }, function (error) {
                console.log("setHostEnvironment promise error");
            });
        }
        return {
            getInstance : function () {
                if (!instance) {
                    instance = init();
                    // initializeHostEnvironment();
                }
                // return instance;
                return {
                    start: init,
                    openNewDisplay : openNewDisplay,
                    setupNewDisplay : setupNewDisplay,
                    initializeHostEnvironment : initializeHostEnvironment
                };
            }
        }
    });

}());
