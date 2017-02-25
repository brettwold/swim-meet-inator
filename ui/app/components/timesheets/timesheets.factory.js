var app = angular.module('SwimResultinator')

app.factory('TimesheetFactory', ['Timesheet', 'ObjectPool', 'TimesheetParser', function(Timesheet, ObjectPool, TimesheetParser) {
  var TimesheetFactory = {
    pool: new ObjectPool('/timesheets', Timesheet, 'timesheets'),
    parser: new TimesheetParser(),
    getTimesheet: function(timesheetId) {
      return this.pool.get(timesheetId);
    },
    loadTimesheets: function() {
      return this.pool.load();
    },
    setTimesheet: function(timesheetData) {
      this.pool.set(timesheetData);
    },
    removeTimesheet: function(timesheet) {
      this.pool.remove(timesheet);
    },
    parseTimesheet: function(importData) {
      return this.parser.parseTimesheet(importData);
    },
    parseTime: function(timeStr) {
      return this.parser.parseTime(timeStr);
    }
  }
  return TimesheetFactory;
}]);

app.factory('Timesheet', ['$http', 'UrlService', function($http, UrlService) {
  function Timesheet(timesheetData) {
    if (timesheetData) {
      this.setData(timesheetData);
    }
  };
  Timesheet.prototype = {
    setData: function(timesheetData) {
      angular.extend(this, timesheetData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/timesheets/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/timesheets/save', this);
    }
  };
  return Timesheet;
}]);

app.directive('timesheet', function ($filter) {
  return {
    replace: true,
    templateUrl: 'partials/timesheet.html',
    link: function ($scope, element, attrs) {
      $scope.$watch('timesheetId', function(newVal, oldVal) {
        var TimesheetFactory = element.injector().get('TimesheetFactory');
        if(newVal) {
          TimesheetFactory.getTimesheet(newVal).then(function(timesheet) {
            $scope.timesheet = timesheet;
          });
        }
      });
    }
  };
})
