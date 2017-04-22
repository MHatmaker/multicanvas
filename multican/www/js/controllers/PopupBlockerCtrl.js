/*global define */
/*global console */

(function () {
    "use strict";

    console.log('PopupBlockerCtrl setup');
    define([
    ], function () {
        console.log('PopupBlockerCtrl define');

        function PopupBlockerCtrl($scope, $uibModalInstance, data) {
            $scope.data = data;
            // $scope.$apply();
            $scope.ok = function () {
                $uibModalInstance.close();
            };

        }


        function init() {
            console.log('PopupBlockerCtrl init');
            var App = angular.module('mapModule');

            App.controller('PopupBlockerCtrl',  ['$scope', '$uibModalInstance', 'data', PopupBlockerCtrl]);

            return PopupBlockerCtrl;
        }

        return { start: init};
    });

// }());
}).call(this);
