var app = angular.module('SwimResultinator')

app.factory('MeetFactory', ['$http', '$q', 'Meet', 'UrlService', function($http, $q, Meet, UrlService) {
  var MeetFactory = {
    _pool: {},
    _retrieveInstance: function(meetId, meetData) {
      var instance = this._pool[meetId];

      if (instance) {
        instance.setData(meetData);
      } else {
        instance = new Meet(meetData);
        this._pool[meetId] = instance;
      }

      return instance;
    },
    _search: function(meetId) {
      return this._pool[meetId];
    },
    _load: function(meetId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/meets/' + meetId)
      .success(function(meetData) {
        var meet = scope._retrieveInstance(meetData.id, meetData);
        deferred.resolve(meet);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getMeet: function(meetId) {
      var deferred = $q.defer();
      var meet = this._search(meetId);
      if (meet) {
        deferred.resolve(meet);
      } else {
        this._load(meetId, deferred);
      }
      return deferred.promise;
    },
    loadMeets: function() {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/meets').success(function(meetsArray) {
        var meets = [];
        meetsArray.rows.forEach(function(meetData) {
          var meet = scope._retrieveInstance(meetData.id, meetData);
          meets.push(meet);
        });

        deferred.resolve(meets);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setMeet: function(meetData) {
      var scope = this;
      var meet = this._search(meetData.id);
      if (meet) {
        meet.setData(meetData);
      } else {
        meet = scope._retrieveInstance(meetData);
      }
      return meet;
    }
  };
  return MeetFactory;
}]);

app.factory('Meet', ['$http', 'UrlService', 'ConfigData', 'TimesheetFactory', function($http, UrlService, ConfigData, TimesheetFactory) {
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
      return $http.get(UrlService.baseUrl + '/api/meets/delete/' + id);
    },
    update: function() {

      delete this.entry_groups;
      delete this.race_types;
      delete this.genders;
      delete this.entry_events_data;
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
      this.race_types_arr = this._addItemToArray(type, this.race_types_arr);
    },
    addEntryGroup: function(group) {
      this.entry_groups_arr = this._addItemToArray(group, this.entry_groups_arr);
    },
    ageAtMeet: function(swimmer) {
      if (!swimmer || !swimmer.dob || !this.meet_date) {
        return false;
      }
      var meetDate = new moment(this.meet_date, "YYYY-MM-DD");
      var dob = new moment(swimmer.dob, "YYYY-MM-DD");
      var duration = moment.duration(meetDate.diff(dob));
      return Math.floor(duration.asYears());
    },
    getGroupForSwimmer: function(swimmer) {
      var aam = this.ageAtMeet(swimmer);
      if (aam) {
        for(key in config.entry_groups) {
          var entryGroup = config.entry_groups[key];
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
    getEntryEvents: function(swimmer) {
      var mins = JSON.parse(this.minimum_timesheet.timesheet_data);
      var maxs = JSON.parse(this.maximum_timesheet.timesheet_data);
      var swimmerGroup = this.getGroupForSwimmer(swimmer).id;
      if(swimmer) {
        var events = [];
        var types = this.entry_events[swimmer.gender][swimmerGroup];
        for(type in types) {
          if(types[type]) {
            var race = config.races[type];
            race.min = mins[swimmer.gender][swimmerGroup][type];
            race.max = maxs[swimmer.gender][swimmerGroup][type];
            var best = swimmer.getBestTime(race.id);
            if(best && race.min) {
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
        return events;
      }
    }
  };
  return Meet;
}]);

app.directive('meetEvents', function ($filter) {
  return {
    replace: true,
    templateUrl: 'app/components/meets/meet-events.html',
    scope: {
      'meetId' : '=',
      'swimmerId' : '='
    },
    link: function ($scope, element, attrs) {
      $scope.$watch('meetId', function(newVal, oldVal) {
        var MeetFactory = element.injector().get('MeetFactory');
        if(newVal) {
          MeetFactory.getMeet(newVal).then(function(meet) {
            $scope.meet = meet;
          });
        }
      });
      $scope.$watch('swimmerId', function(newVal, oldVal) {
        var SwimmerFactory = element.injector().get('SwimmerFactory');
        if(newVal) {
          SwimmerFactory.getSwimmer(newVal).then(function(swimmer) {
            $scope.swimmer = swimmer;
          });
        }
      });
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
