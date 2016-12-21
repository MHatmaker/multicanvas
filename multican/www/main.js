/*global require*/

require({
    baseUrl: 'js',
    paths: {
        'ionic': '../lib/ionic/js/ionic.bundle.min',
        'angularBootstrap' : "//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.2.0",
        'app' : 'app',
        'controllers' : 'controllers',
        'libs' : 'libs',
        'services' : 'services',
        //  'dojox' : 'https://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact',
        // 'esri' : 'https://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact',
        'esri' : 'https://js.arcgis.com/4.1',
        // 'WebMap' : 'https://js.arcgis.com/4.1/esri/WebMap',
        // 'MapView' : 'esri/views/MapView',
        'dojo' : 'https://js.arcgis.com/4.1/dojo',
        // 'domReady' : 'dojo/domReady',
        // 'all' : 'dojo/promise/all'

        // 'utils' : 'https://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact/arcgis/utils'
        // jquery: '../lib/jquery/jquery.min.js'
    }
  // shim: {
  //   'angularBootstrap': {
  //       deps: ['angular']
  //   }
  // }
  // if you are using jquery you have to add a shim for ionic and add jquery as deps
  // shim: {
  //     'ionic': {deps: ['jquery']},
  // }
  // sometimes you need to set the loading priority especially
  // priority: [
  //     'jquery',
  //     'ionic'
  // ]
});

var dojoConfig = {
    baseUrl: 'js',
    packages: [
        {
            name: 'app',
            location: 'js/app'
        }]
        // {
        //     name: 'dojox',
        //     location: 'https://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.5compact'
        // }]

};
