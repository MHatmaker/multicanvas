/*global angular, console, define, document, PusherConfig */

define(function () {
    "use strict";

    console.log("PusherConfig setup");
    var
        self = this,
        instance;

    function init() {
        var
            details = {
                masherChannel : "private-channel-mashchannel",
                masherChannelInitialized : false,
                nginj : null
            };
        console.log("entering PusherConfig");
        details.nginj = angular.element(document.body).injector();

        function getParameterByName(name) {
            // console.log("get paramater " + name + " from " + details.search);
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(self.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    return {
            getChannelFromUrl : function () {
                details.masherChannel = getParameterByName('channel');
                details.masherChannelInitialized = true;
                return details.masherChannel;
            },
            isChannelInitialized : function () {
                return details.masherChannelInitialized;
            },

            setNameChannelAccepted : function (tf) {
                if (details.nameChannelAccepted === false) {
                    details.nameChannelAccepted = true;
                }
                details.nameChannelAccepted = tf;
            },
            isNameChannelAccepted : function () {
                return details.nameChannelAccepted;
            },
            setChannel : function (chnl) {
                if (details.masherChannelInitialized === false) {
                    details.masherChannelInitialized = true;
                }
                details.masherChannel = chnl;
            },
            masherChannel : function (newWindow) {
                // alert(getParameterByName('channel'));
                // alert(details.masherChannel);
                return newWindow ? getParameterByName('channel') : details.masherChannel;
            },
            setInjector : function (inj) {
                details.nginj = inj;
            },
            getInjector : function () {
                return details.nginj;
            }
        };
    }
    return {
        getInstance : function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
}());
