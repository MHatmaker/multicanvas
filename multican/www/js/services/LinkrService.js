/*global require, define, console, document*/

// require(['libs/MultiCanvas']);

define([
    'app'
], function (app) {
    'use strict';
    var
        app = angular.module('app');
    app.value('linkrScopes', {
        lnkrscope : null,
        addScope : function (s) {
            this.lnkrscope = s;
        },
        getScope : function () {
            return this.lnkrscope;
        }
    });
    console.log("ready to create LinkrService");
    app.factory("LinkrService", ['linkrScopes', function (linkrScopes) {
        var
            addScope = function (scope) {
                linkrScopes.addScope(scope);
            },
            hideLinkr = function () {
                var data = {'visibility' : 'none'},
                    scp = linkrScopes.getScope();
                if (scp) {
                    scp.$broadcast('displayLinkerEvent', data);
                }
            },
            showLinkr = function () {
                var data = {'visibility' : 'block'},
                    scp = linkrScopes.getScope();
                if (scp) {
                    scp.$broadcast('displayLinkerEvent', data);
                }
            };

        return {addScope : addScope, hideLinkr: hideLinkr, showLinkr: showLinkr};
    }])
});
