var app = angular.module('SwimResultinator')

app.factory('MeetFactory', ['Meet', 'ObjectPool', function(Meet, ObjectPool) {
  var MeetFactory = {
    pool: new ObjectPool('/api/meets', Meet, 'meets'),
    getMeet: function(meetId) {
      return this.pool.get(meetId);
    },
    loadCurrentMeets: function() {
      return this.pool.load('/api/meets/current');
    },
    loadMeets: function() {
      return this.pool.load('/api/meets');
    },
    setMeet: function(meetData) {
      return this.pool.set(meetData);
    },
    removeMeet: function(meet) {
      return this.pool.delete(meet);
    }
  };
  return MeetFactory;
}]);

app.factory('Meet', ['$http', '$q', 'UrlService', 'ConfigData', 'TimesheetFactory', function($http, $q, UrlService, ConfigData, TimesheetFactory) {
  var config;
  ConfigData.getConfig().then(function(data) {
    config = data;
  });

  function Meet(meetData) {
    if (meetData) {
      this.setData(meetData);
    }
  };
  Meet.prototype = {
    _addItemToArray: function(item, arr) {
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
    },
    setData: function(meetData) {
      angular.extend(this, meetData);
    },
    setConfig: function(config) {
      this.config = config;
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/meets/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/meets/save', this);
    },
    startDate: function() {
      if (!this.meet_date) {
        return false;
      }
      return moment(this.meet_date, "YYYY-MM-DD").format("D MMM YYYY");
    },
    endDate: function() {
      if (!this.end_date) {
        return false;
      }
      return moment(this.end_date, "YYYY-MM-DD").format("D MMM YYYY");
    },
    addEvent: function(index) {
      if(!this.events) {
        this.events = new Array();
      }
      this.events.push( { stroke: config.strokes[index].code } );
    },
    addRaceType: function(type) {
      this.race_types = this._addItemToArray(type, this.race_types);
    },
    addEntryGroup: function(group) {
      this.entry_groups = this._addItemToArray(group, this.entry_groups);
    },
    ageAtMeet: function(swimmer) {
      if (!swimmer || !swimmer.dob || !this.meet_date) {
        return false;
      }
      var dob = new moment(swimmer.dob, "YYYY-MM-DD");

      if (this.age_type == 'AOD') {
        var endDecDate = new moment(this.meet_date, "YYYY-MM-DD");
        endDecDate.date(31);
        endDecDate.month(11);
        var duration = moment.duration(endDecDate.diff(dob));
        return Math.floor(duration.asYears());
      } else if (this.age_type == 'AOE') {
        var now = moment();
        var duration = moment.duration(now.diff(dob));
        return Math.floor(duration.asYears());
      } else {
        var meetDate = new moment(this.meet_date, "YYYY-MM-DD");
        var duration = moment.duration(meetDate.diff(dob));
        return Math.floor(duration.asYears());
      }
    },
    getGroupForSwimmer: function(swimmer) {
      var aam = this.ageAtMeet(swimmer);
      if (aam) {
        for(i = 0; i < this.entry_groups.length; i++) {
          var entryGroup = config.entry_groups[this.entry_groups[i]];
          if(aam >= entryGroup.min && aam < entryGroup.max) {
            return entryGroup;
          }
        }
      }
      return false;
    },
    getRaceTypes: function() {
      var racetypes = [];
      this.race_types.split(',').forEach(function(type) {
        racetypes.push(config.races[type]);
      });

      return racetypes;
    },
    checkEventsAndGroups: function() {
      var self = this;
      if(this.minimum_timesheet_id) {
        TimesheetFactory.getTimesheet(this.minimum_timesheet_id).then(function(timesheet) {
          self.entry_groups = new Array();
          self.race_types = new Array();
          self.genders = new Array();
          self.entry_events = {};

          for(group in timesheet.entry_groups) {
            self.entry_groups.push(timesheet.entry_groups[group]);
          }

          for(race_type in timesheet.race_types) {
            self.race_types.push(timesheet.race_types[race_type]);
          }

          for(gender in timesheet.genders) {
            self.genders.push(timesheet.genders[gender]);
          }

          for(i = 0; i < self.genders.length; i++) {
            self.entry_events[self.genders[i]] = {};
            for(j = 0; j < self.entry_groups.length; j++) {
              self.entry_events[self.genders[i]][self.entry_groups[j]] = {};
              for(k = 0; k < self.race_types.length; k++) {
                self.entry_events[self.genders[i]][self.entry_groups[j]][self.race_types[k]] = true;
              }
            }
          }
        });
      }
    },
    _processMinAndMax: function(swimmer, deferred) {
      var self = this;
      if(swimmer) {
        swimmer.getBestTimes(race.id, this.qual_date).then(function(bestTimes) {
          var mins = this.minimum_timesheet.sheet;
          var maxs =  this.maximum_timesheet.sheet;
          var swimmerGroup = this.getGroupForSwimmer(swimmer).id;
          var events = [];
          var types = this.entry_events[swimmer.gender][swimmerGroup];
          for(type in types) {
            if(types[type]) {
              var race = config.races[type];
              race.min = mins[swimmer.gender][swimmerGroup][type];
              race.max = maxs[swimmer.gender][swimmerGroup][type];

              var best = self._getBestTimeForRaceType(bestTimes, race.id);
              if(best && race.min) {
                race.best = best;
                race.time_present = true;
                if((race.min && race.max && best.time <= race.min && best.time >= race.max) ||
                  (race.min && !race.max && best.time <= race.min)) {
                    race.qualify = true;
                } else {
                  race.qualify = false;
                }
              } else {
                race.time_present = false;
              }
              events.push(race);
            }
          }
          deferred.resolve(events);
        });
      }
    },
    _processMinimumOnly: function(swimmer, deferred) {
      var self = this;
      if(swimmer) {
        swimmer.getBestTimes(self.qual_date).then(function(bestTimes) {
          var events = [];
          var mins = self.minimum_timesheet.sheet;
          var hasAutos = false;
          if(self.auto_timesheet) {
            var autos = self.auto_timesheet.sheet;
            hasAutos = true;
          }
          var swimmerGroup = self.getGroupForSwimmer(swimmer).id;
          var types = self.entry_events[swimmer.gender][swimmerGroup];

          for(type in types) {
            if(types[type]) {
              var race = config.races[type];
              race.min = mins[swimmer.gender][swimmerGroup][type];
              if(hasAutos) {
                race.auto = autos[swimmer.gender][swimmerGroup][type];
              }
              var best = self._getBestTimeForRaceType(bestTimes, race.id);
              if(best && race.min) {
                race.best = best;
                race.time_present = true;
                if(race.min && best.time <= race.min) {
                  if(hasAutos) {
                    if(best.time <= race.auto) {
                      race.qualify_auto = true;
                    } else {
                      race.qualify_auto = false;
                    }
                  }

                  race.qualify = true;
                } else {
                  race.qualify = false;
                }
              } else {
                race.time_present = false;
              }
              events.push(race);
            }
          }
          deferred.resolve(events);
        });
      }
    },
    _processMaximumOnly: function(swimmer, deferred) {

    },
    _processEvents: function(swimmer, deferred) {

    },
    _getBestTimeForRaceType: function(bestTimes, raceType) {
      for(i = 0; i < bestTimes.length; i++) {
        if(bestTimes[i].race_type == raceType) {
          return bestTimes[i];
        }
      }
    },
    getTotalCostForEntries: function(raceEntries) {
      var total = 0;
      if(raceEntries) {
        total += raceEntries.length * this.cost_per_race;
        total += this.admin_fee;
      }
      return total;
    },
    getEntryEvents: function(swimmer) {
      var deferred = $q.defer();

      if (this.minimum_timesheet && this.maximum_timesheet) {
        this._processMinAndMax(swimmer, deferred);
      } else if (!this.minimum_timesheet && this.maximum_timesheet) {
        this._processMaximumOnly(swimmer, deferred);
      } else if (this.minimum_timesheet && !this.maximum_timesheet) {
        this._processMinimumOnly(swimmer, deferred);
      } else {
        this._processEvents(swimmer, deferred);
      }

      return deferred.promise;
    }
  };
  return Meet;
}]);

app.directive('meetEvents', function () {
  return {
    replace: true,
    templateUrl: 'app/components/meets/meet-events.html',
    scope: {
      'meet' : '=',
      'swimmer' : '=',
      'entryEvents': '=',
      'raceEntries': '='
    },
    link: function ($scope, element, attrs, ctrl) {

      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }
      };

      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
    }
  };
});

app.directive('yesNo', function() {
  return {
    template: '<span>{{ yesNo ? "Yes" : "No" }}</span>',
    scope: {
      yesNo: '='
    },
    replace: true
  };
});
