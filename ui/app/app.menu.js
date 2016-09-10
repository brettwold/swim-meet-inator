angular
  .module('SwimResultinator')
  .controller('AppCtrl', AppCtrl)
  .controller('LeftCtrl', LeftCtrl)
  .controller('MenuListCtrl', MenuListCtrl);

function AppCtrl($scope, $http, SessionService, AuthService) {
  AuthService.login(function() {
    $scope.session = SessionService;
    console.log(SessionService);
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
