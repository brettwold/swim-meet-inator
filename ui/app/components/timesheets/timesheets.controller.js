angular
  .module('SwimResultinator')
  .controller('TimesheetCtrl', TimesheetCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('timesheets', 'timesheet', TimesheetCtrl);
  })
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/timesheets/import', {
        templateUrl: '/app/components/timesheets/import.html',
        controller: TimesheetCtrl
      });
  }])
  .filter('raceByCourse', function() {
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

function TimesheetCtrl($scope, $location, $route, $routeParams, TimesheetFactory, ConfigData) {

  $scope.menu = { title: "Timesheet management" };
  $scope.status = $route.current.status;

  $scope.navigateTo = function(to, event) {
    $location.path('/timesheets' + to);
  };

  $scope.parseImport = function() {
    $scope.parseData = TimesheetFactory.parseTimesheet($scope.importData);
  }

  $scope.getAll = function() {
    TimesheetFactory.loadTimesheets().then(function(result) {
      $scope.timesheets = result;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    $scope.status_message = "";
    $scope.timesheet.update().then(function(response) {
      if(response.status == 200) {
        $scope.status_message = "Timesheet saved";
      } else {
        $scope.status_message = "Error saving timesheet";
      }
    })
  };

  $scope.delete = function(id) {
    TimesheetFactory.delete(id);
    $scope.getAll();
  };

  $scope.addRaceType = function(type) {
    $scope.timesheet.race_types_arr = addItemToArray(type, $scope.timesheet.race_types_arr);
  }

  $scope.addEntryGroup = function(group) {
    $scope.timesheet.entry_groups_arr = addItemToArray(group, $scope.timesheet.entry_groups_arr);
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

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($routeParams.id) {
      TimesheetFactory.getTimesheet($routeParams.id).then(function(response) {
        $scope.timesheet = response;
        $scope.menu.title = "Edit timesheet";
      });
    };

    if($scope.status == 'list') {
      $scope.menu.title = "Timesheet management";
    } else if($scope.status == 'edit') {
      $scope.menu.title = "Create new timesheet";
    }
  }

  init();
}
