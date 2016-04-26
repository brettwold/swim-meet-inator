angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .factory('EntryFactory', EntryFactory)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, Config) {

  $scope.config = Config;
  $scope.menu = { title: "Entry management" };
  $scope.status = $route.current.status;
  $scope.meet;
  $scope.entry = {};

  $scope.navigateTo = function(to, event) {
    $location.path('/entries' + to);
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.getAll = function() {
    EntryFactory.getAll().then(function(result) {
      $scope.entrys = result.data;
    });
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Entry management";
  } else if($scope.status == 'edit') {
    MeetFactory.getAll().then(function(result) {
      $scope.meets = result.data.rows;
    });
    SwimmerFactory.getAll().then(function(result) {
      $scope.swimmers = result.data.rows;
    });
    if($scope.entry.id) {
      $scope.menu.title = "Edit entry";
    } else {
      $scope.menu.title = "Create new entry";
    }
  }

  if($routeParams.category) {
    MeetFactory.get($routeParams.category).then(function(response) {
      $scope.meet = response.data;
      EntryFactory.getAllByMeet($scope.meet.id).then(function(result) {
        $scope.entries = result.data;
      });
    });
  } else {
    EntryFactory.getAll().then(function(result) {
      $scope.entries = result.data;
    });
  };
}

function EntryFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/entries');
  }

  factory.getAllByMeet = function(meetId) {
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
