angular
  .module('SwimResultinator')
  .controller('UsersCtrl', UsersCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('users', 'user', UsersCtrl);
  });

function UsersCtrl($scope, $location, $route, $routeParams, UserFactory, ConfigData) {

  $scope.user = {};
  $scope.menu = { title: "User management" };
  $scope.status = $route.current.status;
  $scope.asanum;

  $scope.navigateTo = function(to, event) {
    $location.path('/users' + to);
  };

  $scope.getAll = function() {
    UserFactory.loadUsers().then(function(users) {
      $scope.users = users;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    $scope.user.update();
  };

  $scope.delete = function(id) {
    UserFactory.delete(id);
    $scope.getAll();
  };

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($routeParams.id) {
      UserFactory.getUser($routeParams.id).then(function(user) {
        $scope.user = user;
        $scope.menu.title = "Edit user";
      });
    };

    if($scope.status == 'list') {
      $scope.menu.title = "User management";
    } else if($scope.status == 'edit') {
      $scope.menu.title = "Create new user";
    }
  }
  init();
}
