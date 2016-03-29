angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl)
  .factory('MeetFactory', MeetFactory);

function MeetCtrl($scope, $location, $route, $routeParams, MeetFactory, Config) {

  $scope.meet = {events: {}};
  $scope.menu = { title: "Meet management" };
  $scope.status = $route.current.status;
  $scope.config = Config;

  $scope.navigateTo = function(to, event) {
    $location.path('/meets' + to);
  };

  $scope.getAll = function() {
    MeetFactory.getAll().then(function(result) {
      $scope.meets = result.data;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    MeetFactory.save($scope.meet).then(function(response) {
      $scope.meet = response.data;
    })
  };

  $scope.delete = function(id) {
    MeetFactory.delete(id);
    $scope.getAll();
  };

  $scope.addEvent = function(index) {
    if(!$scope.meet.events) {
      $scope.meet.events = new Array();
    }
    console.log(index);
    $scope.meet.events.push( { stroke: $scope.config.strokes[index].code } );
  }

  $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };

  $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);
    else list.push(item);
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Meet management";
  } else if($scope.status == 'edit') {
    if($scope.meet.id) {
      $scope.menu.title = "Edit meet";
    } else {
      $scope.menu.title = "Create new meet";
    }
  }

  if($routeParams.id) {
    MeetFactory.get($routeParams.id).then(function(response) {
      $scope.meet = response.data;
    });
  };
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
