/*global angular, console, define, document, PusherConfig */

(function () {
    "use strict";

    console.log("PusherConfig setup");
    define([],
        function () {
            console.log("entering PusherConfig");

            function getParameterByName(name) {
                // console.log("get paramater " + name + " from " + details.search);
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(self.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            var
                PusherConfig = function (ndx) {
                    console.log("PusherConfig ctor");
                    var self = this,
                        details = {
                            masherChannel : "private-channel-mashchannel",
                            masherChannelInitialized : false,
                            nginj : null
                        },

                        setChannel = function (chnl) {
                            if (details.masherChannelInitialized === false) {
                                details.masherChannelInitialized = true;
                            }
                            details.masherChannel = chnl;
                        },
                        masherChannel = function (newWindow) {
                            // alert(getParameterByName('channel'));
                            // alert(details.masherChannel);
                            return newWindow ? getParameterByName('channel') : details.masherChannel;
                        },
                        setInjector = function (inj) {
                            details.nginj = inj;
                        },
                        getInjector = function () {
                            return details.nginj;
                        };
                    setInjector(angular.element(document.body).injector());
                    return {
                        setInjector: setInjector,
                        getInjector: getInjector,
                        setChannel: setChannel,
                        masherChannel: masherChannel
                    };
                };

            return {
                PusherConfig : PusherConfig
            };

        });
// }).call(this);
}());
