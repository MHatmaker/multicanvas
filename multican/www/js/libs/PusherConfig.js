/*global angular, console, define, document, PusherConfig, alert*/
/*jslint unparam: true*/

(function () {
    "use strict";

    console.log("PusherConfig setup");

    define([],
        function () {
            var
                details = {
                    masherChannel : "private-channel-mashchannel",
                    masherChannelInitialized : false,
                    nameChannelAccepted : false,
                    userName : 'defaultuser',
                    userId : 'uidnone',
                    nginj : null,
                    pusherPathPre : "http://",
                    pusherPathNgrok : "7e687e1d",
                    pusherPathPost : ".ngrok.io",
                    search : '/'
                };
            console.log("entering PusherConfig");
            details.nginj = angular.element(document.body).injector();

            function getParameterByName(name) {
                // console.log("get paramater " + name + " from " + details.search);
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(details.search);
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
                getPusherChannel : function () {
                    return details.masherChannel;
                },
                getUserName : function () {
                    return details.userName;
                },
                setUserName : function (name) {
                    details.userName = name;
                },
                setUserId : function (uid) {
                    details.userId = uid;
                },
                getUserId : function () {
                    return details.userId;
                },
                setInjector : function (inj) {
                    details.nginj = inj;
                },
                getInjector : function () {
                    return details.nginj;
                },
                getPusherPath : function () {
                    var path = details.pusherPathPre + details.pusherPathNgrok + details.pusherPathPost;
                    console.log("Pusher ngrok path is " + path);
                    return path;
                },
                setSearch : function (searchDetails) {
                    details.search = searchDetails;
                }
            };
        });

}());
