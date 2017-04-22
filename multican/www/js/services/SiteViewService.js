/*global require, define, console, document*/

define([
], function () {
    'use strict';
    var
        app = angular.module('mapModule');

    app.factory("SiteViewService", function () {
        var ExpandSite = "Max Map",
            Symbol = "Expand";
        return {
            setSiteExpansion : function (tf) {
                ExpandSite = tf ? "Max Map" : "Min Map";
                Symbol = tf ? "Expand" : "Collapse";
            },
            getSiteExpansion : function () {
                return ExpandSite;
            },
            getMinMaxSymbol : function () {
                return Symbol;
            }
        };
    });
});
