/*global console, define, document */

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/

(function () {
    "use strict";

    console.log('CarouselCtrl setup');
    define([
        'app',
    ], function (app) {
        console.log("ready to create CarouselCtrl");
        app.controller('CarouselCtrl', ['$scope', 'MapInstanceService',
            function ($scope, MapInstanceService) {
                var
                    counter = 0,
                    items = [],
                    current = items[0];
                $scope.mapcolheight = 480;
                $scope.mapcolWidth = 380;
                $scope.amount = items.length;
                $scope.ActNoAct = 'active';
                // navigate through the carousel
                function navigate(direction) {
                    // hide the old current list item
                    current.classList.remove('current');

                    console.log("change counter from " + counter);
                    // calculate the new position
                    counter = (counter + direction) % $scope.amount;
                    counter = counter < 0 ? $scope.amount - 1 : counter;
                    console.log("to counter " + counter);
                    // set new current element
                    // and add CSS class
                    current = items[counter];
                    $scope.MapNo = counter;
                    current.classList.add('current');
                    MapInstanceService.setCurrentSlide(counter);
                }

                $scope.$on('addslide', function (event, data) {
                    if (items.length > 0) {
                        current.classList.remove('current');
                    }
                    items.push(data.newMapLi);
                    current = items[items.length - 1];
                    $scope.MapNo = items.length - 1;
                    current.classList.add('current');
                    $scope.amount = items.length;
                });
                $scope.$on('removeslide', function () {
                    var currentSlide = counter;
                    console.log("remove slide " + counter + " from items with length" + items.length);
                    if (currentSlide > -1) {
                        items.splice(currentSlide, 1);
                        $scope.amount = items.length;
                        console.log("items length is now " + items.length);
                        navigate(0);
                    }

                });
                // add event handlers to buttons
                $scope.onClickNext = function () {
                    console.log("next");
                    navigate(1);
                };
                $scope.onClickPrev = function () {
                    console.log("prev");
                    navigate(-1);
                };
                // show the first element
                // (when direction is 0 counter doesn't change)
                if (items.length > 0) {
                    navigate(0);
                }
            }
        ]);
    });

}());
