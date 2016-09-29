const enterpathprefix = '/app/components/enter';
const enterbase = '/enter';
angular
  .module('SwimResultinator')
  .controller('EnterCtrl', EnterCtrl)
  .config(function($routeProvider) {
    $routeProvider
    .when(enterbase, {
      templateUrl: enterpathprefix + "/enter.html",
      controller: EnterCtrl
    });
  });

function EnterCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, ConfigData) {

  $scope.menu = { title: "Enter a Meet" };
  $scope.swimmer;
  $scope.meetId;


  $scope.navigateTo = function(to, event) {
    $location.path('/enter' + to);
  };

  $scope.moveToNext = function() {
    $scope.message = '';
    if(!$scope.swimmer && $scope.asaregno) {
      SwimmerFactory.getSwimmerByRegNo($scope.asaregno).then(function(swimmer) {
        $scope.swimmer = swimmer;
      }, function(error) {
        $scope.message = 'Failed to find swimmer: ' + error;
      });
    }
  }

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    MeetFactory.loadCurrentMeets().then(function(meets) {
      console.log(meets);
      $scope.meets = meets;
    });

  }
  init();
}
