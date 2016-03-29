angular
  .module('SwimResultinator')
  .controller('EntryCtrl', MeetCtrl)
  .factory('EntryFactory', EntryFactory);

function MeetCtrl($scope, $location, $route, $routeParams, EntryFactory, Config) {

  $scope.meet = {events: {}};
  $scope.config = Config;

  $scope.navigateTo = function(to, event) {
    $location.path('/entries' + to);
  };
}

function EntryFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function(meetId) {
    return $http.get(UrlService.baseUrl + '/api/entries/' + meetId);
  }

  factory.get = function(meetId, id) {
    return $http.get(UrlService.baseUrl + '/api/entries/' + meetId + '/' + id);
  }

  factory.save = function(id) {
    return $http.post(UrlService.baseUrl + '/api/entries/save', id);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/entries/delete/' + id);
  }

  return factory;
}
