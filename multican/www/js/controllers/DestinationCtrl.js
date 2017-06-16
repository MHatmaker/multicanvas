/*global console, define, document, angular, Promise, $uibModal, $uibModalStack */

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/

(function () {
    "use strict";

    console.log('DestinationCtrl setup');
    define([
    ], function () {
        var selfMethods = {},
            isInstantiated = false;
        console.log("ready to create DestinationCtrl");
        function DestinationCtrl($scope, $window, $uibModal, $uibModalStack, CurrentMapTypeService) {
            console.log("Inside DestinationCtrl ctor");
            var modalInstance;

            $scope.destSelections = [
                {'option' : "Same Window", 'showing' : "destination-option-showing"},
                {'option' : "New Tab", 'showing' : "destination-option-showing"},
                {'option' : "New Pop-up Window", 'showing' : "destination-option-showing"}];

            $scope.selectedDestination = "Same Window";
            $scope.gsearch = {};

            $scope.data = {
                dstSel : $scope.destSelections[0].option,
                prevDstSel : $scope.destSelections[0].option,
                title : 'map has no title',
                icon : null,
                snippet : 'nothing in snippet',
                mapType : $scope.currentMapSystem.maptype,
                imgSrc : $scope.currentMapSystem.imgSrc,
                destSelections : $scope.destSelections,
                query : "no query yet"

            };

            $scope.preserveState = function () {
                console.log("preserveState");

                $scope.data.prevDstSel = $scope.data.dstSel;
                console.log("preserve " + $scope.data.prevDstSel + " from " + $scope.data.dstSel);
            };

            $scope.restoreState = function () {
                console.log("restoreState");

                console.log("restore " + $scope.data.dstSel + " from " + $scope.data.prevDstSel);
                $scope.data.dstSel = $scope.data.prevDstSel;
            };
            $scope.updateState = function (selectedDestination) {
                console.log("updateState");
                $scope.selectedDestination  = selectedDestination;
                $scope.data.dstSel = $scope.data.prevDstSel = selectedDestination;
            };

            $scope.cancel = function () {
                modalInstance.dismiss('cancel');
            };

            function getDestination(info) {
                return new Promise(function (resolve, reject) {
                    $scope.showDestDialog = function (info) {
                        console.log("showDestDialog for currentMapSystem ");
                        console.debug($scope.currentMapSystem);
                        $scope.preserveState();
                        $scope.data.mapType = info.maptype;
                        $scope.currentMapSystem = CurrentMapTypeService.getMapConfigurationForType(info.maptype);

                        if (info) {
                            $scope.data.icon = info.icon;
                            $scope.data.title = info.title;
                            $scope.data.snippet = info.snippet;
                            $scope.data.id = info.id;
                            $scope.data.query = "";
                        } else {
                            $scope.data.mapType = $scope.currentMapSystem.maptype;
                            $scope.data.icon = $scope.currentMapSystem.imgSrc;
                            $scope.data.query = $scope.gsearch.query;
                        }

                        modalInstance = $uibModal.open({
                            templateUrl : '/templates/DestSelectDlgGen.html',   // .jade will be appended
                            controller : 'DestWndSetupCtrl',
                            backdrop : true,
                            animation : false,
                            animate : 'none',
                            windowClass : 'no-animation-modal',
                            uibModalAnimationClass : 'none',

                            resolve : {
                                data: function () {
                                    return $scope.data;
                                }
                            }
                        });

                        modalInstance.result.then(function (info) {
                            $scope.updateState(info.dstSel);
                            $uibModalStack.dismissAll("go away please");
                            resolve(info);
                        }, function () {
                            console.log('Modal dismissed at: ' + new Date());
                            $scope.restoreState();
                            reject('dismissed');
                        });

                    };
                    $scope.showDestDialog(info);
                });
            }
            selfMethods.getDestination = getDestination;
        }

        function getDestination(info) {
            return selfMethods.getDestination(info);
        }

        function init() {
            if (!isInstantiated) {
                isInstantiated = true;
                console.log('DestinationCtrl init');
                var locApp = angular.module('mapModule');

                locApp.controller('DestinationCtrl', ['$scope', '$window', '$uibModal', '$uibModalStack', 'CurrentMapTypeService', DestinationCtrl]);
            }
            return {
                getDestination : getDestination
            };
        }

        return {
            start: init,
            getDestination : getDestination
        };
    });
}());
