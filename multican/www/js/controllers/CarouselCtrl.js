/*global console, define, document, angular */

/*jslint es5: true */
/*jslint unparam: true*/
/*jslint browser: true*/

(function () {
    "use strict";

    console.log('CarouselCtrl setup');
    define([
    ], function () {
        console.log("ready to create CarouselCtrl");
        var selfMethods = {};
        function CarouselCtrl($scope, MapInstanceService) {
            var
                getCurrentSlideNumber,
                activeSlideNumber = 0,
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

                console.log("change activeSlideNumber from " + activeSlideNumber);
                // calculate the new position
                activeSlideNumber = (activeSlideNumber + direction) % $scope.slidesCount;
                activeSlideNumber = activeSlideNumber < 0 ? $scope.slidesCount - 1 : activeSlideNumber;
                console.log("to activeSlideNumber " + activeSlideNumber);
                // set new currentSlide element
                // and add CSS class
                currentSlide = items[activeSlideNumber].mapListItem;
                $scope.MapNo = activeSlideNumber;
                $scope.MapName = items[activeSlideNumber].mapName;
                currentSlide.classList.add('current');
                MapInstanceService.setCurrentSlide(items[activeSlideNumber].slideNumber);
            }

            $scope.$on('addslide', function (event, slideData) {
                if (items.length > 0) {
                    currentSlide.classList.remove('current');
                }
                items.push(slideData);
                currentSlide = items[items.length - 1].mapListItem;
                activeSlideNumber = $scope.MapNo = items.length - 1;
                $scope.MapName = slideData.mapName;
                currentSlide.classList.add('current');
                $scope.slidesCount = items.length;
            });
            $scope.$on('removeslide', function () {
                var slideToRemove = activeSlideNumber,
                      slideElement = document.getElementById('slide' + slideToRemove);
                console.log("remove slide " + activeSlideNumber + " from items array with length" + items.length);
                if (slideToRemove > -1) {
                    items.splice(slideToRemove, 1);
                    $scope.slidesCount = items.length;
                    console.log("items length is now " + items.length);
                    if (slideToRemove) {
                        slideElement.remove();
                    }
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
            // (when direction is 0 activeSlideNumber doesn't change)
            if (items.length > 0) {
                navigate(0);
            }

            getCurrentSlideNumber = function () {
                return items[activeSlideNumber].slideNumber;
            };
            selfMethods.getCurrentSlideNumber = getCurrentSlideNumber;
        }

        function getCurrentSlideNumber() {
            return selfMethods.getCurrentSlideNumber();
        }
        function init() {
            console.log('CarouselCtrl init');
            var locApp = angular.module('mapModule');

            locApp.controller('CarouselCtrl', ['$scope', 'MapInstanceService', CarouselCtrl]);
            // angular.bootstrap(document.getElementById('year'), ['example']);

            return CarouselCtrl;
        }
        // function getConfigCurrentSlideNumber () {
        //
        // }

        return {
            start: init,
            getCurrentSlideNumber : getCurrentSlideNumber
        };
    });
}());
