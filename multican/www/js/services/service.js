define([
  'app'
], function (app) {
  'use strict';

  console.log("ready to create service");
  app.service('myService', [
    function () {
      console.log("service to return Ionic-Heads");
      this.getName = function () {
        return 'Ionic-Heads';
      };
    }
  ]);
});
