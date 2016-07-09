var app = angular.module('SwimResultinator')

app.factory('TimesheetFactory', ['$http', '$q', 'Timesheet', 'UrlService', function($http, $q, Timesheet, UrlService) {
  var TimesheetFactory = {
    _pool: {},
    _retrieveInstance: function(timesheetId, timesheetData) {
      var instance = this._pool[timesheetId];
      
      if (instance) {
        instance.setData(timesheetData);
      } else {
        instance = new Timesheet(timesheetData);
        this._pool[timesheetId] = instance;
      }

      return instance;
    },
    _search: function(timesheetId) {
      return this._pool[timesheetId];
    },
    _load: function(timesheetId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/timesheets/' + timesheetId)
      .success(function(timesheetData) {
        var timesheet = scope._retrieveInstance(timesheetData.id, timesheetData);
        deferred.resolve(timesheet);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getTimesheet: function(timesheetId) {
      var deferred = $q.defer();
      var timesheet = this._search(timesheetId);
      if (timesheet) {
        deferred.resolve(timesheet);
      } else {
        this._load(timesheetId, deferred);
      }
      return deferred.promise;
    },
    loadTimesheets: function() {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/timesheets').success(function(timesheetsArray) {
        var timesheets = [];
        timesheetsArray.rows.forEach(function(timesheetData) {
          var timesheet = scope._retrieveInstance(timesheetData.id, timesheetData);
          timesheets.push(timesheet);
        });

        deferred.resolve(timesheets);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setTimesheet: function(timesheetData) {
      var scope = this;
      var timesheet = this._search(timesheetData.id);
      if (timesheet) {
        timesheet.setData(timesheetData);
      } else {
        timesheet = scope._retrieveInstance(timesheetData);
      }
      return timesheet;
    }
  };
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
      return $http.get(UrlService.baseUrl + '/api/timesheets/delete/' + id);
    },
    update: function() {
      delete this.entry_groups;
      delete this.race_types;
      delete this.genders;
      delete this.timesheet_data;
      return $http.put(UrlService.baseUrl + '/api/timesheets/save', this);
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
