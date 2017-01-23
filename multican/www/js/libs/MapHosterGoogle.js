/*global require, define, console, google, navigator, alert*/
/*jslint unparam: true*/

(function () {
    "use strict";
    console.log("MapHosterGoogle setup, ready to require stuff in MapHosterGoogle");

    define([
        'libs/MLConfig'
    ], function (MLConfig) {
        console.log('MapHosterGoogle define');
        var
            // hostName = "MapHosterGoogle",
            // google,
            MapHosterGoogle = function (gMap, mapno, mapOptions, goooogle, googPlaces) {
                this.mphmap = gMap;
                this.mapNumber = mapno;
                this.google = goooogle;
                var self = this,
                    selfPusherDetails = {
                        channel : null,
                        pusher : null
                    },
                    init = function () {
                        console.log("init method in MapHosterGoogle");
                    },
                    getMapNumber = function () {
                        return self.mapNumber;
                    },
                    setPusherClient = function (pusher, channel) {
                        console.log("MapHosterGoogle setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        var $inj = self.mlconfig.getInjector(),
                            evtSvc = $inj.get('PusherEventHandlerService'),
                            evtDct = evtSvc.getEventDct(),
                            key;

                        if (selfPusherDetails.pusher === null) {
                            selfPusherDetails.pusher = pusher;
                            selfPusherDetails.channel = channel;
                            self.pusherconfig.setChannel(channel);

                            $inj = self.mlconfig.getInjector();
                            evtSvc = $inj.get('PusherEventHandlerService');
                            evtDct = evtSvc.getEventDct();
                            for (key in evtDct) {
                                if (evtDct.hasOwnProperty(key)) {
                                    pusher.subscribe(key, evtDct[key]);
                                }
                            }

                            // pusher.subscribe( 'client-MapXtntEvent', retrievedBounds);
                            // pusher.subscribe( 'client-MapClickEvent', retrievedClick);
                            // pusher.subscribe( 'client-NewMapPosition', retrievedNewPosition);
                            console.log("reset MapHosterArcGIS setPusherClient, selfPusherDetails.pusher " +  selfPusherDetails.pusher);
                        }
                    },
                    centerOnMe = function () {
                        console.log("centerOnMe for map " + self.mapNumber);
                        navigator.geolocation.getCurrentPosition(function (pos) {
                            self.mphmap.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                            //$scope.loading.hide();
                        }, function (error) {
                            alert('Unable to get location: ' + error.message);
                        });
                    },
                    addPopup = function (msg, centerCoord) {
                        var infowindow = new google.maps.InfoWindow({
                            content: msg
                        }),
                            //  self = this,
                            centerLatLng = new google.maps.LatLng(centerCoord.lat, centerCoord.lng),

                            marker = new google.maps.Marker({
                                position: centerLatLng,
                                map: self.mphmap,
                                title: 'Uluru (Ayers Rock)'
                            });

                        google.maps.event.addListener(marker, 'click', function () {
                            infowindow.open(self.map, marker);
                        });
                    };

                return {
                    init: init,
                    getMapNumber: getMapNumber,
                    setPusherClient: setPusherClient,
                    centerOnMe: centerOnMe,
                    addPopup: addPopup
                };
            };

        return {
            MapHosterGoogle: MapHosterGoogle
        };
    });

}());
