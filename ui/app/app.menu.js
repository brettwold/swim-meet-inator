angular
  .module('SwimResultinator')
  .controller('AppCtrl', AppCtrl)
  .controller('LeftCtrl', LeftCtrl)
  .controller('MenuListCtrl', MenuListCtrl);

function AppCtrl($scope, $http, $location, SessionService, AuthService) {
  AuthService.login(function() {
    $scope.session = SessionService;
    $scope.menu = { title: "SwimResultinator" };
    $scope.status = "index";
    console.log($scope.session.user);
    if(!$scope.session.authenticated) {
      $location.path('/login');
    }
  });
}

function LeftCtrl($scope, SessionService) {
  var session = SessionService;
  $scope.session = SessionService;
}

function MenuListCtrl($scope, $location, SessionService) {
  var session = SessionService;
  $scope.session = SessionService;

  $scope.navigateTo = function(to, event) {
      $location.path(to);
  };
}
