/*global console, define, document */

(function () {
    "use strict";

    console.log('CarouselCtrl setup');
    define([
        'app'
    ], function (app) {
        console.log("ready to create CarouselCtrl");
        app.controller('CarouselCtrl', ['$scope',
            function ($scope) {
                    // Read necessary elements from the DOM once
                var box = document.querySelector('.carouselbox'),
                // Define the global counter, the items and the
                // current item
                    counter = 0,
                    items = [], //box.getElementsByClassName('.content li'),
                    amount = items.length,
                    current = items[0];
                box.classList.add('active');

                $scope.$on('addslide', function (event, data) {
                    if (items.length > 0) {
                        current.classList.remove('current');
                    }
                    items.push(data.newMapLi);
                    current = items[items.length - 1];
                    current.classList.add('current');
                    amount = items.length;
                });
                this.addSlide = function (newMapLi) {
                    if (items.length > 0) {
                        current.classList.remove('current');
                    }
                    items.push(newMapLi);
                    current = items[items.length - 1];
                    current.classList.add('current');
                    amount = items.length;
                };
                // navigate through the carousel
                function navigate(direction) {
                // hide the old current list item
                    current.classList.remove('current');

                    console.log("change counter from " + counter);
                    // calculate the new position
                    counter = (counter + direction) % amount;
                    counter = counter < 0 ? amount - 1 : counter;
                    console.log("to counter " + counter);
                    // set new current element
                    // and add CSS class
                    current = items[counter];
                    console.debug(current.classList);
                    current.classList.add('current');
                    console.debug(current.classList);
                }
                // add event handlers to buttons
                $scope.onClickNext = function(clickedItem) {
                    console.log("next")
                    navigate(1);
                };
                $scope.onClickPrev = function(clickedItem) {
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
