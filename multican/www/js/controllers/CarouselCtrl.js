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
                    currentSlide = items[0];
                $scope.mapcolheight = 480;
                $scope.mapcolWidth = 380;
                $scope.slidesCount = items.length;
                $scope.ActNoAct = 'active';
                // navigate through the carousel
                function navigate(direction) {
                    // hide the old currentSlide list item
                    currentSlide.classList.remove('current');

                    console.log("change counter from " + counter);
                    // calculate the new position
                    counter = (counter + direction) % $scope.slidesCount;
                    counter = counter < 0 ? $scope.slidesCount - 1 : counter;
                    console.log("to counter " + counter);
                    // set new currentSlide element
                    // and add CSS class
                    currentSlide = items[counter].mapListItem;
                    $scope.MapNo = counter;
                    $scope.MapName = items[counter].mapName;                    currentSlide.classList.add('current');
                    MapInstanceService.setCurrentSlide(items[counter].slideNumber);
                }

                $scope.$on('addslide', function (event, slideData) {
                    if (items.length > 0) {
                        currentSlide.classList.remove('current');
                    }
                    items.push(slideData);
                    currentSlide = items[items.length - 1].mapListItem;
                    counter = $scope.MapNo = items.length - 1;
                    $scope.MapName = slideData.mapName;
                    currentSlide.classList.add('current');
                    $scope.slidesCount = items.length;
                });
                $scope.$on('removeslide', function () {
                    var slideToRemove = counter;
                    console.log("remove slide " + counter + " from items array with length" + items.length);
                    if (slideToRemove > -1) {
                        items.splice(slideToRemove, 1);
                        $scope.slidesCount = items.length;
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
