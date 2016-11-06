/*global console, define, document */

define([
    'app'
], function (app) {
    "use strict";
    console.log("ready to create SimpleSlides service");
    app.service('SimpleSlidesService', [
        function () {
                // Read necessary elements from the DOM once
            var box = document.querySelector('.carouselbox'),
                next = box.querySelector('.next'),
                prev = box.querySelector('.prev'),
            // Define the global counter, the items and the
            // current item
                counter = 0,
                items = [], //box.getElementsByClassName('.content li'),
                amount = items.length,
                current = items[0];
            box.classList.add('carouselactive');

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

                // calculate the new position
                counter = (counter + direction) % amount;
                counter = counter < 0 ? amount - 1 : counter;
                // set new current element
                // and add CSS class
                current = items[counter];
                current.classList.add('current');
            }
            // add event handlers to buttons
            next.addEventListener('click', function (ev) {
                navigate(1);
            });
            prev.addEventListener('click', function (ev) {
                navigate(-1);
            });
                // show the first element
                // (when direction is 0 counter doesn't change)
            if (items.length > 0) {
                navigate(0);
            }
        }]);
});
