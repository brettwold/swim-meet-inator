angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl)
  .factory('MeetFactory', MeetFactory);

function MeetCtrl($scope, $location, $routeParams, MeetFactory) {

  $scope.meet = {};
  $scope.meet_types = ["Level 1", "Level 2", "Level 3", "Level 4"];
  $scope.lanes = ["6", "8", "10"];

  $scope.navigateTo = function(to, event) {
    $location.path('/meets' + to);
  };

  $scope.getAll = function() {
    MeetFactory.getAll().then(function(result) {
      $scope.meets = result.data;
    });
  };

  $scope.save = function() {
    MeetFactory.save($scope.meet).then(function(response) {
      $scope.meet = response.data;
    })
  }

  $scope.delete = function(id) {
    MeetFactory.delete(id);
    $scope.getAll();
  }

  if($routeParams.id) {
    MeetFactory.get($routeParams.id).then(function(response) {
      $scope.meet = response.data;
    });
  }
}

function MeetFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/meets');
  }

  factory.get = function(id) {
    return $http.get(UrlService.baseUrl + '/api/meets/' + id);
  }

  factory.save = function(meet) {
    return $http.post(UrlService.baseUrl + '/api/meets/add', meet);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/meets/delete/' + id);
  }

  return factory;
}
