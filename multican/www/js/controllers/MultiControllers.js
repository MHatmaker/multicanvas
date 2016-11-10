console.log("open module")
var app = angular.module('myApp', []);
mapInstance = 0;

console.log("instantiate unused controller");
app.controller('unusedController', function($scope) {
  console.log("unusedController");
  console.debug($scope);
  $scope.open = function(){
    alert('this is never called, this controller is not actually used');
  };
});

console.log("instantiate app controller");
app.controller('appCtrl', function($scope) {
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
  $scope.addCanvas = function(clickedItem) {
    var mapDctv = document.createElement('mapdirective'),
      parentDiv = document.getElementById('MapContainer');
    parentDiv.appendChild(mapDctv);
    angular.element(mapDctv).injector().invoke(function($compile) {
      var scope = angular.element(mapDctv).scope();
      $compile(mapDctv)(scope);
      console.log("compiled mapDctv");
      console.debug(scope);
      scope.startMap();
    });

    $scope.safeApply(function () {console.log("safeApply callback")});
  }
});

app.directive('mapdirective', function ($compile) {
  var mapId = "map" + mapInstance;
  return {
    restrict : 'E',
    controller : 'MapCtrl',
    link : function(s, e, a) {
      var mapDiv = angular.element(
                '<div ng-controller="MapCtrl" id="map' + mapInstance + '" style="width:400px;height:400px">' +
                  '<div data-tap-disabled="true" class="map"></div> ' +
                '</div>');
      $compile(mapDiv)(s);
      e.append(mapDiv);
    }
  }
});

mapInstance = 0;
console.log("instantiate Map controller");
app.controller('MapCtrl', function($scope, $compile) {
      function initialize() {
        console.log("initialize controller");
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map" + mapInstance),
            mapOptions);
        mapInstance++;

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      $scope.startMap = function() {
        initialize();
      }

      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      // initialize();

    });

/*
<!DOCTYPE html>
<html ng-app="myApp">

  <head>
    <script data-require="angular.js@*" data-semver="1.2.14" src="http://code.angularjs.org/1.2.14/angular.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es&sensor=true"></script>
    <script src="script.js"></script>
  </head>

  <body ng-controller="appCtrl">
    <h1>Hello Plunker!</h1>
    <div id="MapContainer">
      <button id="addcanbtn" ng-click="addCanvas()" value="Add Canvas" class="btn">Add Canvas</button>
    </div>
  </body>

</html>
*/
/*
<!DOCTYPE html>
<html ng-app="myApp">

  <head>
    <script data-require="angular.js@*" data-semver="1.2.14" src="http://code.angularjs.org/1.2.14/angular.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es&sensor=true"></script>
    <script src="script.js"></script>
  </head>

  <body ng-controller="appCtrl">
    <h1>Hello Plunker!</h1>
    <div ng-controller="MapCtrl" style="width:400px;height:400px">
      <div id="map0" data-tap-disabled="true" class="map"></div>
    </div>
    <div ng-controller="MapCtrl" style="width:400px;height:400px">
      <div id="map1" data-tap-disabled="true" class="map"></div>
    </div>
    <button id="addcanbtn" ng-click="addCanvas()" value="Add Canvas" class="btn">Add Canvas</button>
  </body>

</html>

*/