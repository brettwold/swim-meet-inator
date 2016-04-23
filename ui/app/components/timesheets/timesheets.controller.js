angular
  .module('SwimResultinator')
  .controller('TimesheetCtrl', TimesheetCtrl)
  .factory('TimesheetFactory', TimesheetFactory)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('timesheet', TimesheetCtrl);
  })
  .filter('raceByCourse', function(Config) {
    return function(input, search) {
      if (!input) return input;
      if (!search) return input;
      var expected = ('' + search).toLowerCase();
      var result = {};
      angular.forEach(input, function(value, key) {
        var actual = value.course_type;

        if (actual.toLowerCase() === expected) {
          result[key] = value;
        }
      });
      return result;
    }
  });

function TimesheetCtrl($scope, $location, $route, $routeParams, TimesheetFactory, Config) {

  $scope.config = Config;
  $scope.menu = { title: "Timesheet management" };
  $scope.status = $route.current.status;

  $scope.navigateTo = function(to, event) {
    $location.path('/timesheets' + to);
  };

  $scope.getAll = function() {
    TimesheetFactory.getAll().then(function(result) {
      $scope.timesheets = result.data;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    TimesheetFactory.save($scope.timesheet).then(function(response) {
      $scope.timesheet = response.data;
    })
  };

  $scope.delete = function(id) {
    TimesheetFactory.delete(id);
    $scope.getAll();
  };

  $scope.addRaceType = function(type) {
    for(idx in $scope.timesheet.race_types_arr) {
      if($scope.timesheet.race_types_arr[idx] == type) return;
    }
    $scope.timesheet.race_types_arr.push(type);
  }

  if($routeParams.id) {
    TimesheetFactory.get($routeParams.id).then(function(response) {
      $scope.timesheet = response.data;
      $scope.menu.title = "Edit timesheet";
    });
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Timesheet management";
  } else if($scope.status == 'edit') {
    $scope.menu.title = "Create new timesheet";
  }
}

function TimesheetFactory($http, UrlService) {
  var factory = {};

  factory.getAll = function() {
    return $http.get(UrlService.baseUrl + '/api/timesheets');
  }

  factory.get = function(id) {
    return $http.get(UrlService.baseUrl + '/api/timesheets/' + id);
  }

  factory.save = function(timesheet) {
    return $http.post(UrlService.baseUrl + '/api/timesheets/save', timesheet);
  }

  factory.delete = function(id) {
    return $http.get(UrlService.baseUrl + '/api/timesheets/delete/' + id);
  }

  return factory;
}
