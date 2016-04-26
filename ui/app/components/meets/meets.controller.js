angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl)
  .factory('MeetFactory', MeetFactory)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('meets', 'meet', MeetCtrl);
  });

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

  $scope.addRaceType = function(type) {
    $scope.meet.race_types_arr = addItemToArray(type, $scope.meet.race_types_arr);
  }

  $scope.addEntryGroup = function(group) {
    $scope.meet.entry_groups_arr = addItemToArray(group, $scope.meet.entry_groups_arr);
  }

  function addItemToArray(item, arr) {
    if(item) {
      for(idx in arr) {
        if(arr[idx] == item) return arr;
      }

      var new_arr = arr;
      if(new_arr === null) {
        new_arr = [];
      }
      new_arr.push(item);
      return new_arr.sort();
    }

    return arr;
  }

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
    MeetFactory.getAllTimesheets().then(function(result){
      $scope.timesheets = result.data;
    });
  };
}

function MeetFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/meets');
  }

  factory.getAllTimesheets = function() {
    return $http.get(UrlService.baseUrl + '/api/timesheets');
  }

  factory.get = function(id) {
    return $http.get(UrlService.baseUrl + '/api/meets/' + id);
  }

  factory.save = function(meet) {
    delete meet.entry_groups;
    delete meet.race_types;
    delete meet.genders;
    delete meet.entry_events_data;
    return $http.post(UrlService.baseUrl + '/api/meets/save', meet);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/meets/delete/' + id);
  }

  return factory;
}
