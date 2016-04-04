angular
  .module('SwimResultinator')
  .controller('ClubCtrl', ClubCtrl)
  .factory('ClubFactory', ClubFactory)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('club', ClubCtrl);
  });

function ClubCtrl($scope, $location, $route, $routeParams, ClubFactory, Config) {

  $scope.club = {};
  $scope.config = Config;
  $scope.menu = { title: "Club management" };
  $scope.status = $route.current.status;
  $scope.asanum;

  $scope.navigateTo = function(to, event) {
    $location.path('/clubs' + to);
  };

  $scope.getAll = function() {
    ClubFactory.getAll().then(function(result) {
      $scope.clubs = result.data;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    ClubFactory.save($scope.club).then(function(response) {
      $scope.club = response.data;
    })
  };

  $scope.delete = function(id) {
    ClubFactory.delete(id);
    $scope.getAll();
  };

  $scope.findSwimmer = function() {
    ClubFactory.getSwimmer($scope.asanum).then(function(response) {
      $scope.swimmer = response.data;
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

  if($routeParams.id) {
    ClubFactory.get($routeParams.id).then(function(response) {
      $scope.club = response.data;
      $scope.menu.title = "Edit club";
    });
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Club management";
  } else if($scope.status == 'edit') {
    $scope.menu.title = "Create new club";
  }
}

function ClubFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/clubs');
  }

  factory.get = function(id) {
    return $http.get(UrlService.baseUrl + '/api/clubs/' + id);
  }

  factory.getSwimmer = function(asanum) {
    return $http.get(UrlService.baseUrl + '/api/asa/swimmer/' + asanum);
  }

  factory.addSwimmer = function(swimmer) {
    return $http.post(UrlService.baseUrl + '/api/clubs/addswimmer', swimmer);
  }

  factory.deleteSwimmer = function(id) {
    return $http.post(UrlService.baseUrl + '/api/clubs/deleteswimmer', {id: id});
  }

  factory.save = function(club) {
    return $http.post(UrlService.baseUrl + '/api/clubs/add', club);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/clubs/delete/' + id);
  }

  return factory;
}
