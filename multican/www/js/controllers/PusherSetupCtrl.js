/*global define, console, $modalInstance, angular */
/*global Pusher */
/*jslint es5: true */

(function () {
    "use strict";

    console.log('PusherSetup setup');
    var areWeInitialized = false,
        pusherPathPre = "http://",
        pusherPathNgrok = "d3099ee5",
        pusherPathPost = ".ngrok.io/pusher/auth";
        // areWeInstantiated = false;
    define([
        'libs/PusherConfig',
        'libs/MLConfig'
    ], function (PusherConfig, MLConfig) {
        console.log('PusherSetupCtrl define');

        var selfdict = {
            'scope' : null,
            'mph' : null,
            'pusher' : null,
            'callbackFunction' : null,
            'info' : null,
            'isInitialized' : false,
            'PusherClient' : null,
            'userName' : '',
            'isInstantiated' : false,
            'serverUrl' : 'http://linkr622-arcadian.rhcloud.com/',
            'clients' : {},
            displayPusherDialog : null
        },
            selfMethods = {},
            createPusherClient,
            setupPusherClient;

        function PusherSetupCtrl($scope, $uibModal) {
            console.log("in PusherSetupCtrl");
            selfdict.isInstantiated = areWeInitialized = false;
            console.log("areWeInitialized is " + areWeInitialized);
            $scope.privateChannelMashover = PusherConfig.getInstance().masherChannel();
            selfdict.scope = $scope;
            selfdict.scope.userName = selfdict.userName;
            selfdict.pusher = null;
            selfdict.isInitialized = areWeInitialized = false;
            selfdict.clients = {};
            selfdict.eventHandlers = {};

            $scope.showDialog = selfdict.scope.showDialog = false;
            $scope.data = {
                privateChannelMashover : PusherConfig.getInstance().masherChannel(),
                prevChannel : 'mashchannel',
                userName : selfdict.userName,
                prevUserName : selfdict.userName,
                whichDismiss : "Cancel"
            };
            selfdict.userName = $scope.data.userName;

            function PusherChannel(chnl) {
                var pusher,
                    APP_ID = '40938',
                    APP_KEY = '5c6bad75dc0dd1cec1a6',
                    APP_SECRET = '54546672d0196be97f6a',
                    channel = chnl,
                    channelBind,
                    chlength = channel.length,
                    channelsub = channel.substring(1);
                console.log("PusherChannel ready to create channel");
                // this.eventDct = eventDct;

                if (channel[0] === '/') {
                    chlength = channel.length;
                    channelsub = channel.substring(1);
                    channelsub = channelsub.substring(0, chlength - 2);
                    channel = channelsub;
                }

                selfdict.CHANNEL = channel.indexOf("private-channel-") > -1 ? channel : 'private-channel-' + channel;
                console.log("with channel " + selfdict.CHANNEL);

                // pusher = new Pusher({appId: app_id, key: app_key, secret: app_secret});
                // pusher = new Pusher(APP_KEY);
                selfdict.pusher = pusher = new Pusher(APP_KEY, {
                    authTransport: 'jsonp',
                    authEndpoint: pusherPathPre + pusherPathNgrok + pusherPathPost,  // 'http://f705b06e.ngrok.io/pusher/auth', //'http://linkr622-arcadian.rhcloud.com/',
                    clientAuth: {
                        key: APP_KEY,
                        secret: APP_SECRET,
                        // user_id: USER_ID,
                        // user_info: {}
                    }
                });
                pusher.connection.bind('state_change', function (state) {
                    if (state.current === 'connected') {
                        // alert("Yipee! We've connected!");
                        console.log("Yipee! We've connected!");
                    } else {
                        // alert("Oh-Noooo!, my Pusher connection failed");
                        console.log("Oh-Noooo!, my Pusher connection failed");
                    }
                });
                console.log("Pusher subscribe to channel " + selfdict.CHANNEL);
                channelBind = pusher.subscribe(selfdict.CHANNEL);

                /*
                channelBind.bind('client-MapXtntEvent', function (frame)
                 {  // Executed when a messge is received
                     console.log('frame is',frame);
                     self.eventDct.retrievedBounds(frame);
                     console.log("back from boundsRetriever");
                 }
                );
                 */

                channelBind.bind('client-NewUrlEvent', function (frame) {
                    console.log('frame is', frame);
                    // eventDct['client-NewUrlEvent'](frame);
                    console.log("back from NewUrlEvent");
                });

                channelBind.bind('client-NewMapPosition', function (frame) {
                    console.log('frame is', frame);
                    // handler = mapHoster.getPusherEventHandler().getHandler('client-NewMapPosition');
                    // handler(frame);
                    // selfdict.eventDct['client-NewMapPosition'](frame);
                    console.log("back from NewMapPosition Event");
                });

                console.log("BIND to client-MapXtntEvent");

                channelBind.bind('client-MapXtntEvent', function (frame) {
                    console.log('frame is', frame);
                    var handlerkey,
                        obj;
                    for (handlerkey in selfdict.eventHandlers) {
                        if (selfdict.eventHandlers.hasOwnProperty(handlerkey)) {
                            obj = selfdict.eventHandlers[handlerkey];
                            obj.eventDct['client-MapXtntEvent'](frame);
                        }
                    }
                    console.log("back from boundsRetriever");
                });

                channelBind.bind('client-MapClickEvent', function (frame) {
                    console.log('frame is', frame);
                    // eventDct['client-MapClickEvent'](frame);
                    console.log("back from clickRetriever");
                });

                channelBind.bind('pusher:subscription_error', function (statusCode) {
                    //alert('Problem subscribing to "private-channel": ' + statusCode);
                    console.log('Problem subscribing to "private-channel": ' + statusCode);
                });
                channelBind.bind('pusher:subscription_succeeded', function () {
                    console.log('Successfully subscribed to "' + selfdict.CHANNEL); // + 'r"');
                });
            }

            function PusherClient(evtDct, channel, clientName, mph, cbfn) {
                var mapHoster = mph,
                    callbackfunction = cbfn;

                // allMapTypes = serv.getMapTypes();
                // mptLength = allMapTypes.length;
                //
                // console.log("BEWARE OF SIDE EFFECTS");
                // console.log("Attempt to setPusherClient for all defined map types");
                // for (i = 0; i < mptLength; i +=  1) {
                //     maptypekey = allMapTypes[i].type;
                //     maptypeobj = allMapTypes[i].mph;
                //     console.log("PusherSetupCtrl iteratively setting pusher client for hoster type: " + maptypekey);
                //     if (maptypeobj && maptypeobj !== "undefined") {
                //         maptypeobj.setPusherClient(pusher, selfdict.CHANNEL);
                //         maptypeobj.setUserName(selfdict.userName);
                //     }
                // }
                selfdict.eventHandlers[clientName] = mph.getPusherEventHandler();

                mapHoster.setPusherClient(selfdict.pusher, channel);
                //maptypeobj.setUserName(selfdict.userName);

                // console.log("CurrentMapTypeService got mph, call setPusherClient");
                // selfdict.mph.setPusherClient(pusher, selfdict.CHANNEL);
                // selfdict.mph.setUserName(selfdict.userName);
                // selfdict.eventDct = selfdict.mph.getEventDictionary();
                //
                //selfdict.eventDct = maptypeobj.getEventDictionary();


                if (selfdict.info) {
                    callbackfunction(channel, clientName,
                        selfdict.info.destination, selfdict.info.currentMapHolder, selfdict.info.newWindowId, selfdict.info.query);
                } else {
                    callbackfunction(channel, clientName, null);
                }
            }

            $scope.preserveState = function () {
                console.log("preserveState");
                // $scope.data.whichDismiss = 'Cancel';
                $scope.data.prevChannel = $scope.data.privateChannelMashover;
                console.log("preserve " + $scope.data.prevChannel + " from " + $scope.data.privateChannelMashover);
                $scope.data.prevChannel = $scope.data.userName;
                console.log("preserve " + $scope.data.prevUserName + " from " + $scope.data.userName);
            };

            $scope.restoreState = function () {
                console.log("restoreState");
                // $scope.data.whichDismiss = 'Accept';
                console.log("restore " + $scope.data.privateChannelMashover + " from " + $scope.data.prevChannel);
                $scope.data.privateChannelMashover = $scope.data.prevChannel;
                console.log("restore " + $scope.data.userName + " from " + $scope.data.prevChannel);
                $scope.data.userName = $scope.data.prevUserName;
            };

            $scope.onAcceptChannel = function () {
                var pusher,
                    clientName = mlconfig.getUserName() + mlconfig.getMapNumber();
                console.log("onAcceptChannel " + $scope.data.privateChannelMashover);
                selfdict.userName = $scope.data.userName;
                selfdict.CHANNEL = $scope.data.privateChannelMashover;
                PusherConfig.getInstance().setChannel($scope.data.privateChannelMashover);
                PusherConfig.getInstance().setNameChannelAccepted(true);
                if (!pusher) {
                    pusher = new PusherChannel(selfdict.CHANNEL);
                }
                selfdict.clients[foo] = new PusherClient(selfdict.eventDct,
                    $scope.data.privateChannelMashover,
                    $scope.data.userName,
                    selfdict.callbackFunction,
                    selfdict.info);
                selfdict.eventDct = selfdict.mph.getEventDictionary();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.displayPusherDialog = function () {
                // selfdict.scope = $scope;
                // selfdict.scope.showModal(true);
                console.log("displayPusherDialog");
                var tmplt = ' \
                  <div class="modal-dialog", style="width: 100%;"> \
                    <div class="modal-content"> \
                      <div class="modal-header"> \
                          <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button> \
                          <h4>Sharing Setup</h4> \
                      </div> \
                      <div class="modal-body"> \
                        <h4>Create a Pusher Channel ID :</h4> \
                        <input type="text" name="input" ng-model="data.privateChannelMashover" ng-init="data.privateChannelMashover" style="width: 100%"> \
                        <div>channel name : {{data.privateChannelMashover}}</div> \
                        <h4>Enter a User Name :</h4> \
                        <input type="text" name="input" ng-model="data.userName", ng-init="data.userName" style="width: 100%"> \
                        <div style="color: #17244D; margin-top: 10px;">USER NAME : {{data.userName}}</div> \
                      <div class="modal-footer"> \
                        <button type="button" class="btn btn-primary" ng-click="accept()">Accept</button> \
                        <button type="button" class="btn btn-secondary" ng-click="cancel()">Cancel</button> \
                      </div> \
                    </div><!-- /.modal-content --> \
                  </div><!-- /.modal-dialog --> \
                ',
                    modalInstance = $uibModal.open({
                        template : tmplt,
                        controller : 'PusherCtrl',
                        size : 'sm',
                        backdrop : 'false',
//                        appendTo : hostElement,
                        resolve : {
                            data: function () {
                                return $scope.data;
                            }
                        }
                    });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    selfdict.scope.data.userName = selectedItem.userName;
                    selfdict.scope.data.privateChannelMashover = selectedItem.privateChannelMashover;
                    selfdict.scope.onAcceptChannel();
                }, function () {
                    console.log('Pusher Modal dismissed at: ' + new Date());
                });

            };
            selfdict.displayPusherDialog = $scope.displayPusherDialog;

            $scope.hitEnter = function (evt) {
                if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.name, null) || angular.equals($scope.name, ''))) {
                    $scope.save();
                }
            }; // end hitEnter

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && (typeof fn === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            createPusherClient = function (mlconfig, cbfn, nfo) {
                console.log("PusherSetupCtrl.createPusherClient");
                var mapHoster = mlconfig.getMapHosterInstance(),
                    pusher,
                    clientName = mlconfig.getUserName() + mlconfig.getMapNumber();

                if (!selfdict.pusher) {
                    pusher = new PusherChannel(PusherConfig.getInstance().getPusherChannel());
                }
                selfdict.CHANNEL = PusherConfig.getInstance().getPusherChannel();
                selfdict.userName = mlconfig.getUserName();
                selfdict.mapNumber = mlconfig.getMapNumber();
                if (selfdict.scope) {
                    selfdict.scope.data.userName = mlconfig.getUserName();
                }
                selfdict.callbackFunction = cbfn;
                selfdict.info = nfo;
                console.log("createPusherClient for map " + clientName);
                selfdict.clients[clientName] = new PusherClient(mapHoster.getEventDictionary(), selfdict.CHANNEL, clientName, mapHoster, cbfn);
                // selfdict.clients[clientName] = new PusherClient(angular.copy(mapHoster.getEventDictionary()), selfdict.CHANNEL, clientName, mapHoster, cbfn);
                return selfdict.clients[clientName];
            };
            selfMethods.createPusherClient = createPusherClient;

            setupPusherClient = function (eventDct, userName, cbfn, nfo) {
                selfdict.eventDct = eventDct;
                selfdict.userName = userName;
                if (selfdict.scope) {
                    selfdict.scope.data.userName = userName;
                }
                selfdict.callbackFunction = cbfn;
                selfdict.info = nfo;
                selfdict.displayPusherDialog();
            };
            selfMethods.setupPusherClient = setupPusherClient;

            // isinitialized = function () {
            //     return selfdict.isinitialized;
            // };
            // selfmethods.isinitialized = isinitialized;
            //
            // isinstantiated = function () {
            //     return selfdict.isinstantiated;
            // };
            // selfmethods.isInstantiated = isInstantiated;
        }

        // function setupPusherClient(eventDct, userName, cbfn, nfo) {
        //     selfMethods.setupPusherClient(eventDct, userName, cbfn, nfo);
        // }
        //
        // function createPusherClient(eventDct, pusherChannel, initName, cbfn, nfo) {
        //     selfMethods.createPusherClient(eventDct, pusherChannel, initName, cbfn, nfo);
        // }

        // function PusherClient(eventDct, channel, userName, cbfn) {
        //     return selfMethods.PusherClient(eventDct, channel, userName, cbfn);
        // }


        function publishPanEvent(frame) {
            console.log('frame is', frame);
            var handler,
                obj;
            for (handler in selfdict.eventHandlers) {
                if (selfdict.eventHandlers.hasOwnProperty(handler)) {
                    obj = selfdict.eventHandlers[handler];
                    console.log("publish pan event to map " + selfdict.eventHandlers[handler].getMapNumber());
                    obj.eventDct['client-MapXtntEvent'](frame);
                }
            }
        }
        function isInstantiated() {
            return selfMethods.isInstantiated;
        }

        // function createPusherClient(pusherChannel, mlconfig, cbfn, nfo) {
        //     return selfMethods.createPusherClient(pusherChannel, mlconfig, cbfn, nfo);
        // }
        //
        // function setupPusherClient(eventDct, userName, cbfn, nfo) {
        //     return selfMethods.setupPusherClient(eventDct, userName, cbfn, nfo);
        // }
        function createPusherClient(mlconfig, cbfn, nfo) {
            return selfMethods.createPusherClient(mlconfig, cbfn, nfo);
        }
        function setupPusherClient(eventDct, userName, cbfn, nfo) {
            return selfMethods.setupPusherClient(eventDct, userName, cbfn, nfo);
        }

        function init() {
            console.log('PusherSetup init');
            var App = angular.module('mapModule');
            // alert("areWeInitialized ?");
            // alert(areWeInitialized);
            // if (areWeInitialized == true) {
                // alert("quick bailout");
                // return;
            // }
            if (!selfdict.isInitialized) {
                selfdict.isInitialized = areWeInitialized = true;
                App.controller('PusherSetupCtrl',  ['$scope', '$uibModal', 'CurrentMapTypeService', PusherSetupCtrl]);
            }

            // PusherSetupCtrl.self.scope = PusherSetupCtrl.$scope;
            // SearcherCtrlMap.CurrentWebMapIdService= CurrentWebMapIdService;
            return PusherSetupCtrl;
        }

        return { start: init,
                  publishPanEvent : publishPanEvent,
                  setupPusherClient : setupPusherClient,
                  createPusherClient : createPusherClient,
                  isInstantiated : isInstantiated};

    });

}());

// }).call(this);
