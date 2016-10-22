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

function TimesheetCtrl($location, $route, $routeParams, TimesheetFactory, ConfigData) {

  angular.extend(this, {
    menu: { title: "Timesheet management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      if($routeParams.id) {
        TimesheetFactory.getTimesheet($routeParams.id).then(function(response) {
          self.timesheet = response;
          self.menu.title = "Edit timesheet";
        });
      } else {
        self.getAll();
      }

      if(self.status == 'list') {
        self.menu.title = "Timesheet management";
      } else if(self.status == 'edit') {
        self.menu.title = "Create new timesheet";
      }
    },
    navigateTo: function(to, event) {
      $location.path('/timesheets' + to);
    },
    parseImport: function() {
      var self = this;
      self.timesheet = TimesheetFactory.parseTimesheet(self.importData);
    },
    getAll: function() {
      var self = this;
      TimesheetFactory.loadTimesheets().then(function(result) {
        self.timesheets = result;
      });
    },
    add: function() {
      this.navigateTo('/edit');
    },
    save: function() {
      var self = this;
      self.status_message = "";
      self.timesheet.update().then(function(response) {
        if(response.status == 200) {
          self.status_message = "Timesheet saved";
        } else {
          self.status_message = "Error saving timesheet";
        }
      })
    },
    delete: function(id) {
      var self = this;
      TimesheetFactory.getTimesheet(id).then(function(timesheet) {
        timesheet.delete();
        TimesheetFactory.removeTimesheet(timesheet);
        self.getAll();
      });
    },
    addRaceType: function(type) {
      var self = this;
      self.timesheet.race_types_arr = self.addItemToArray(type, self.timesheet.race_types_arr);
    },
    addEntryGroup: function(group) {
      var self = this;
      self.timesheet.entry_groups_arr = self.addItemToArray(group, self.timesheet.entry_groups_arr);
    },
    addItemToArray: function(item, arr) {
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
  });

  this.init();
}
