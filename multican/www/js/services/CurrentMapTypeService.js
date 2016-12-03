/*global define, console*/
/*jslint es5: true*/

define([
    'app',
    'libs/StartupGoogle',
    'libs/StartupArcGIS',
    'libs/MapHosterGoogle',
    'libs/MapHosterArcGIS',
    'controllers/MapCtrl'
], function (app, StartupGoogle, StartupArcGIS, MapHosterGoogle, MapHosterArcGIS, MapCtrl) {
    'use strict';

    app.value('mapsvcScopes', {
        scopes : [],
        addScope : function (s) {
            this.scopes.push(s);
        },
        getScopes : function () {
            return this.scopes;
        }
    });

    console.log("ready to create MapInstanceService");
    app.service('CurrentMapTypeService', ['mapsvcScopes', function (mapsvcScopes) {
        var mapTypes = {
            // 'leaflet': MapHosterLeaflet,
            'google' : MapHosterGoogle,
            'arcgis' : MapHosterArcGIS
        },
            mapStartups = {
                // 'leaflet': StartupLeaflet,
                'google' : StartupGoogle,
                'arcgis' : StartupArcGIS
            },
            currentMapType = 'google',
            selectedMapType = 'google',
            previousMapType = 'google',

            mapRestUrl = {
                'leaflet': 'leaflet',
                'google' : 'google',
                'arcgis' : 'arcgis',
                'Leaflet': 'leaflet',
                'GoogleMap' : 'google',
                'ArcGIS' : 'arcgis'

            },

            mapType2Config = {
                'leaflet': 2,
                'google' : 0,
                'arcgis' : 1
            },

            contentsText = ' \
                The {0} tab opens a typical web page \
                displaying typical web page stuff, including a div with {1} \
                programmed with {2} embedded in it.',
            mapSystemDct = {
                'google' : 0,
                'arcgis' : 1,
                'leaflet' : 2
            },
            mapconfigs = [
                {
                    maptype : 'google',
                    title : 'Google Maps',
                    site : 'Web Site featuring a Google Map',
                    content : contentsText.format('Google Map', 'a Google map', 'google map content'),
                    url : "/partials/google.html",
                    imgSrc : "img/googlemap.png",
                    imgAlt : "Google Map",
                    active : true,
                    disabled : false
                },
                {
                    maptype : 'arcgis',
                    title : 'ArcGIS Web Maps',
                    site : 'Web Site featuring an ArcGIS Online Map',
                    content : contentsText.format('ArcGIS', 'an ArcGIS Web Map', 'ArcGIS Online content'),
                    url : "/partials/arcgis.html",
                    imgSrc : "img/arcgis.png",
                    imgAlt : "ArcGIS Web Maps",
                    active : false,
                    disabled : false
                },
                {
                    maptype : 'leaflet',
                    title : 'Leaflet/OSM Maps',
                    site : 'Web Site featuring a Leaflet Map',
                    content : contentsText.format('Leaflet/OSM Map',  'a Leaflet/OSM map', 'Leaflet content'),
                    url : "/partials/leaflet.html",
                    imgSrc :  "img/Leaflet.png",
                    imgAlt : "Leaflet/OSM Maps",
                    active : false,
                    disabled : false
                }
            ];

        this.getMapTypes = function () {
            var values = Object.keys(mapTypes).map(function (key) {
                return {'type' : key, 'mph' : mapTypes[key]};
            });
            return values;

            // var mapTypeValues = [];
            // for (var key in mapTypes){
                // mapTypeValues.push(mapTypes[key]);
            // return mapTypes;
        };
        this.getMapConfigurations = function () {
            return mapconfigs;
        };
        this.getCurrentMapConfiguration = function () {
            return mapconfigs[mapType2Config[currentMapType]];
        };
        this.getSpecificMapType = function (key) {
            return mapTypes[key];
        };
        this.getCurrentMapType = function () {
            return mapTypes[currentMapType];
        };
        this.getMapStartup = function () {
            return mapStartups[currentMapType];
        };
        this.getMapTypeKey = function () {
            return selectedMapType;
        };
        this.getMapRestUrl = function () {
            return mapRestUrl[selectedMapType];
        };
        this.getMapRestUrlForType = function (tp) {
            return mapRestUrl[tp];
        };
        this.setCurrentMapType = function (mpt) {
            var data = {
                'whichsystem' : mapconfigs[mapSystemDct[mpt]],
            },
                scp = mapsvcScopes.getScopes()[0];
            previousMapType = currentMapType;
            selectedMapType = mpt;
            currentMapType = mpt;
            console.log("selectedMapType set to " + selectedMapType);
            MapCtrl.invalidateCurrentMapTypeConfigured();
            if (scp) {
                scp.$broadcast('SwitchedMapSystemEvent', data);
            }
        };
        this.getPreviousMapType = function () {
            return mapTypes[previousMapType];
        };
        this.getSelectedMapType = function () {
            console.log("getSelectedMapType : " + selectedMapType);
            return mapTypes[selectedMapType];
        };

        this.addScope = function (scope) {
            mapsvcScopes.addScope(scope);
        };
        this.forceAGO = function () {
        // Simulate a click on ArcGIS Ago mapSystem "Show the Map" buttons under the map system tabs.
        // The listener resets the $locationPath under the ng-view.
        // This code should be entered in a new window created by a publish event with the map system
        // in the url

            var data = {
                'whichsystem' : mapconfigs[mapSystemDct.arcgis],
                'newpath' : "/views/partials/arcgis"
            },
                scp = mapsvcScopes.getScopes()[0];
            if (scp) {
                scp.$broadcast('ForceAGOEvent', data);
            }
            console.log("forceAGO setting path to : " + data.newpath);
            // window.location.pathname += "/views/partials/GoogleMap";
            // window.location.reload();
        };

        this.forceMapSystem = function (mapSystem) {
        // Simulate a click on one of the mapSystem "Show the Map" buttons under the map system tabs.
        // The listener resets the $locationPath under the ng-view.
        // This code should be entered in a new window created by a publish event with the map system
        // in the url

            var data = {'whichsystem' : mapconfigs[mapSystemDct[mapSystem]], 'newpath' : "/views/partials/" + mapSystem},
                scp = mapsvcScopes.getScopes()[0];
            if (scp) {
                scp.$broadcast('ForceMapSystemEvent', data);
            }
            console.log("forceMapSystem setting path to : " + data.newpath);
        };

    }]);
});
