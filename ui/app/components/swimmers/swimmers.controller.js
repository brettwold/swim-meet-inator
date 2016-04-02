angular
.module('SwimResultinator')
.controller('SwimmersCtrl', SwimmersCtrl)
.factory('SwimmerFactory', SwimmerFactory);

function SwimmersCtrl($scope, $location, $route, $routeParams, SwimmerFactory, Config) {

  $scope.swimmer = {};
  $scope.config = Config;
  $scope.menu = { title: "Swimmer management" };
  $scope.status = $route.current.status;
  $scope.asanum;

  $scope.navigateTo = function(to, event) {
    $location.path('/swimmers' + to);
  };

  $scope.getAll = function() {
    SwimmerFactory.getAll().then(function(result) {
      $scope.swimmers = result.data;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    SwimmerFactory.save($scope.swimmer).then(function(response) {
      $scope.swimmer = response.data;
    })
  };

  $scope.delete = function(id) {
    SwimmerFactory.delete(id);
    $scope.getAll();
  };

  $scope.lookupTimes = function() {
    SwimmerFactory.lookupTimes($scope.swimmer.regno).then(function(response) {
      $scope.swimmer.SwimTimes = response.data.times;
    });
  }

  if($routeParams.id) {
    SwimmerFactory.get($routeParams.id).then(function(response) {
      $scope.swimmer = response.data;
      $scope.menu.title = "Edit swimmer";
    });
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Swimmer management";
  } else if($scope.status == 'edit') {
    $scope.menu.title = "Create new swimmer";
  }
}

function SwimmerFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/swimmers');
  }

  factory.get = function(id) {
    return $http.get(UrlService.baseUrl + '/api/swimmers/' + id);
  }

  factory.lookupTimes = function(asanum) {
    return $http.get(UrlService.baseUrl + '/api/asa/swimmer/' + asanum);
  }

  factory.getByClub = function(id) {
    return $http.get(UrlService.baseUrl + '/api/swimmers/club/' + id);
  }

  factory.save = function(club) {
    return $http.post(UrlService.baseUrl + '/api/swimmers/add', club);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/swimmers/delete/' + id);
  }

  return factory;
}
