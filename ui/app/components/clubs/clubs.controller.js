angular
  .module('SwimResultinator')
  .controller('ClubCtrl', ClubCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('clubs', 'club', ClubCtrl);
  });

function ClubCtrl($scope, $location, $route, $routeParams, ClubFactory, SwimmerFactory, ConfigData) {

  $scope.club = {};
  $scope.menu = { title: "Club management" };
  $scope.status = $route.current.status;
  $scope.asanum;

  $scope.navigateTo = function(to, event) {
    $location.path('/clubs' + to);
  };

  $scope.getAll = function() {
    ClubFactory.loadClubs().then(function(result) {
      $scope.clubs = result;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    ClubFactory.save($scope.club).then(function(response) {
      $scope.club = response;
    })
  };

  $scope.delete = function(id) {
    ClubFactory.delete(id);
    $scope.getAll();
  };

  $scope.findSwimmer = function() {
    SwimmerFactory.getSwimmer($scope.asanum).then(function(response) {
      $scope.swimmer = response;
    });
  }

  $scope.addSwimmer = function() {
    if($scope.club) {
      $scope.swimmer.club_id = $scope.club.id;
      ClubFactory.addSwimmer($scope.swimmer).then(function(response) {
        $scope.swimmer = null;
      });
    }
  }

  $scope.deleteSwimmer = function(id) {
    ClubFactory.deleteSwimmer(id).then(function(response) {
      $scope.swimmers = response.data;
    });
  }

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($routeParams.id) {
      ClubFactory.getClub($routeParams.id).then(function(response) {
        $scope.club = response;
        $scope.menu.title = "Edit club";
      });
    };

    if($scope.status == 'list') {
      $scope.menu.title = "Club management";
    } else if($scope.status == 'edit') {
      $scope.menu.title = "Create new club";
    }
  }

  init();
}
