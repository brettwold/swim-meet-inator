var app = angular.module('SwimResultinator')

app.factory('TimesheetFactory', ['$http', '$q', 'Timesheet', 'UrlService', 'ConfigData', function($http, $q, Timesheet, UrlService, ConfigData) {
  var config;
  ConfigData.getConfig().then(function(data) {
    config = data;
  });

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

      $http.get(UrlService.baseUrl + '/api/timesheets').success(function(res) {
        var timesheetsArray = res.timesheets;
        var timesheets = [];
        timesheetsArray.forEach(function(timesheetData) {
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
    },
    removeTimesheet: function(timesheet) {
      delete this._pool[timesheet.id];
    },
    _getAliasMatch: function(chk, aliases) {
      for(key in aliases) {
        var aliasGroup = aliases[key];
        for(alias in aliasGroup) {
          if(aliasGroup[alias] == chk) {
            return key;
          }
        }
      }
    },
    _parseGender: function(genderString) {
      if (genderString) {
        var chk = genderString.trim().toLowerCase();
        return this._getAliasMatch(chk, config.gender_aliases);
      }
    },
    _parseGroupType: function(groupString) {
      if (groupString) {
        var chk = groupString.trim().toLowerCase();
        return this._getAliasMatch(chk, config.group_aliases);
      }
    },
    _parseRaceType: function(raceTypeString) {
      if (raceTypeString) {
        var chk = raceTypeString.trim().toLowerCase();
        for (race_type in config.races) {
          if (chk == config.races[race_type].name.toLowerCase()) {
            return race_type;
          }
        }
      }
    },
    _checkForGender: function(line, parseData) {
      var gender = this._parseGender(line);
      if (gender) {
        if (parseData.genders_arr.indexOf(gender) < 0) {
          parseData.genders_arr.push(gender);
        }
        return gender;
      }
    },
    _checkForHeadings: function(cols, gender, parseData) {
      var found = false;
      for (j = 0; j < cols.length; j++) {
        var group = this._parseGroupType(cols[j]);
        if (group) {
          console.log(parseData.entry_groups_arr.indexOf(group));
          if (parseData.entry_groups_arr.indexOf(group) < 0) {
            parseData.entry_groups_arr.push(group);
          }
          parseData.sheet[gender][group] = {};
          found = true;
        }
      }
      return found;
    },
    _checkForRaceType: function(firstCol, parseData) {
      var raceType = this._parseRaceType(firstCol);
      if (raceType) {
        if (parseData.race_types_arr.indexOf(raceType) < 0) {
          parseData.race_types_arr.push(raceType);
        }
        return raceType;
      }
    },
    parseTime: function(timeStr) {
      if(timeStr) {
        var tArr = timeStr.split(/[\.:]+/);
        switch(tArr.length) {
          case 3:
            var m = parseInt(tArr[0] || 0) * 60 * 100;
            var s = parseInt(tArr[1] || 0) * 100;
            var h = parseInt(tArr[2] || 0);
            return m + s + h;
          case 2:
            var s = parseInt(tArr[0] || 0) * 100;
            var h = parseInt(tArr[1] || 0);
            return s + h;
          case 1:
          default:
            var s = parseInt(tArr[0] || 0) * 100;
            return s;
        }
      }
    },
    _checkForTimes: function(timeCols, colOffset, gender, raceType, parseData) {
      for(i = colOffset; i < timeCols.length; i++) {
        if(parseData.entry_groups_arr.length > (i-colOffset)) {
          var time = this.parseTime(timeCols[i]);
          parseData.sheet[gender][parseData.entry_groups_arr[i-colOffset]][raceType] = time;
        }
      }
    },
    parseTimesheet: function(importData) {
      var lines = importData.split('\n');
      var gender;
      if (lines && lines.length > 0) {
        var parseData = new Timesheet({ genders_arr: [], entry_groups_arr: [], race_types_arr: [], sheet: {} });
        console.log("Found " + lines.length + " lines");
        var lineCount = 0;
        while(lineCount < lines.length) {
          console.log("Begin parse");
          var gender = this._checkForGender(lines[lineCount++], parseData);
          if(gender) {
            parseData.sheet[gender] = {};
            var cols = lines[lineCount++].split(',');
            console.log("Found " + cols.length + " columns");
            if (cols.length > 1) {
              if (this._checkForHeadings(cols, gender, parseData)) {
                do {
                  var timeCols = lines[lineCount].split(',');
                  console.log("Found " + timeCols.length + " time columns");
                  if (timeCols.length > 1) {
                    var raceType = this._checkForRaceType(timeCols[0], parseData);
                    if(raceType) {
                      this._checkForTimes(timeCols, 1, gender, raceType, parseData);
                    }
                    lineCount++;
                  }
                } while (lineCount < lines.length && timeCols.length > 1)
              }
            }
          }
        }
        console.log(parseData);
        return parseData;
      }
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
      return $http.get(UrlService.baseUrl + '/api/timesheets/delete/' + this.id);
    },
    update: function() {
      delete this.entry_groups;
      delete this.race_types;
      delete this.genders;
      delete this.timesheet_data;
      console.log(this);
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
