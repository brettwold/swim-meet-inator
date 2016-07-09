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

app.factory('Meet', ['$http', 'UrlService', 'Config', function($http, UrlService, Config) {
  function Meet(meetData) {
    if (meetData) {
      this.setData(meetData);
    }
  };
  Meet.prototype = {
    setData: function(meetData) {
      angular.extend(this, meetData);
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
        for(key in Config.entry_groups) {
          var entryGroup = Config.entry_groups[key];
          if(aam >= entryGroup.min && aam < entryGroup.max) {
            return entryGroup;
          }
        }
      }
      return false;
    },
    getGroupIdForSwimmer: function(swimmer) {
      var aam = this.ageAtMeet(swimmer);
      if (aam) {
        for(key in Config.entry_groups) {
          var entryGroup = Config.entry_groups[key];
          if(aam >= entryGroup.min && aam < entryGroup.max) {
            return key;
          }
        }
      }
      return false;
    },
    getRaceTypes: function() {
      var racetypes = [];
      this.race_types.split(',').forEach(function(type) {
        racetypes.push(Config.races[type]);
      });

      return racetypes;
    },
    getEntryEvents: function(swimmer) {
      if(swimmer) {
        var events = [];
        console.log(JSON.stringify(this.entry_events[swimmer.gender][this.getGroupIdForSwimmer(swimmer)]));
        var types = this.entry_events[swimmer.gender][this.getGroupIdForSwimmer(swimmer)];
        for(type in types) {
          if(types[type]) {
            console.log("Race type " + type);
            events.push(Config.races[type]);
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
    link: function ($scope, element, attrs) {
      $scope.$watch('meetId', function(newVal, oldVal) {
        var MeetFactory = element.injector().get('MeetFactory');
        if(newVal) {
          MeetFactory.getMeet(newVal).then(function(meet) {
            $scope.meet = meet;
          });
        }
      });
    }
  };
})
