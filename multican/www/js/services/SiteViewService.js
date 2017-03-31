/*global require, define, console, document*/

// require(['libs/MultiCanvas']);

define([
    'app'
], function (app) {
    'use strict';

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
