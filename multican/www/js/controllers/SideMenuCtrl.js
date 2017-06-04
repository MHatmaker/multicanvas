/*global console, define, document, angular */

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/

(function () {
    "use strict";

    console.log('SideMenuCtrl setup');
    define([
        'controllers/CanvasHolderCtrl',
    ], function (CanvasHolderCtrlArg) {
        console.log("ready to create SideMenuCtrl");
        var CanvasHolderCtrl = CanvasHolderCtrlArg;
        function SideMenuCtrl($scope, MapInstanceService) {
            console.log("SideMenuCtrl ctor");
            $scope.addNewMap = function (mapType) {
                // alert("new map of type " + mapType);
                console.log("new map of type " + mapType);
                // $rootScope.$broadcast('selectMapTypeEvent', {'mapType': mapType});
                // var $inj = angular.element(document.body).injector(),
                //     canvasHolder = $inj.get('CanvasHolderCtrl');
                CanvasHolderCtrl.addCanvas(mapType);
            };
        }
        function init() {
            console.log('SideMenuCtrl init');
            var locApp = angular.module('mapModule');

            locApp.controller('SideMenuCtrl', ['$scope', '$rootScope', SideMenuCtrl]);
            // angular.bootstrap(document.getElementById('year'), ['example']);

            return SideMenuCtrl;
        }

        return {
            start: init
        };
    });
}());
