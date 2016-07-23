angular
  .module('SwimResultinator')
  .controller('SwimmersCtrl', SwimmersCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('swimmers', 'swimmer', SwimmersCtrl);
  });

function SwimmersCtrl($scope, $location, $route, $routeParams, SwimmerFactory, ConfigData) {

  $scope.swimmer = {};
  $scope.menu = { title: "Swimmer management" };
  $scope.status = $route.current.status;
  $scope.asanum;

  $scope.navigateTo = function(to, event) {
    $location.path('/swimmers' + to);
  };

  $scope.getAll = function() {
    SwimmerFactory.loadSwimmers().then(function(swimmers) {
      $scope.swimmers = swimmers;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    $scope.swimmer.update();
  };

  $scope.delete = function(id) {
    SwimmerFactory.delete(id);
    $scope.getAll();
  };

  $scope.lookupTimes = function() {
    SwimmerFactory.lookupTimes($scope.swimmer.regno).then(function(times) {
      $scope.swimmer.SwimTimes = times;
    });
  }

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($routeParams.id) {
      SwimmerFactory.getSwimmer($routeParams.id).then(function(swimmer) {
        $scope.swimmer = swimmer;
        $scope.menu.title = "Edit swimmer";
      });
    };

    if($scope.status == 'list') {
      $scope.menu.title = "Swimmer management";
    } else if($scope.status == 'edit') {
      $scope.menu.title = "Create new swimmer";
    }
  }
  init();
}
