var app = angular.module('SwimResultinator')

app.factory('SwimmerFactory', ['$http', '$q', 'Swimmer', 'UrlService', function($http, $q, Swimmer, UrlService) {
  var SwimmerFactory = {
    _pool: {},
    _retrieveInstance: function(swimmerId, swimmerData) {
      var instance = this._pool[swimmerId];

      if (instance) {
        instance.setData(swimmerData);
      } else {
        instance = new Swimmer(swimmerData);
        this._pool[swimmerId] = instance;
      }

      return instance;
    },
    _search: function(swimmerId) {
      return this._pool[swimmerId];
    },
    _load: function(swimmerId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/swimmers/' + swimmerId)
      .success(function(swimmerData) {
        var swimmer = scope._retrieveInstance(swimmerData.id, swimmerData);
        deferred.resolve(swimmer);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getSwimmer: function(swimmerId) {
      var deferred = $q.defer();
      var swimmer = this._search(swimmerId);
      if (swimmer) {
        deferred.resolve(swimmer);
      } else {
        this._load(swimmerId, deferred);
      }
      return deferred.promise;
    },
    loadSwimmers: function() {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/swimmers')
      .success(function(swimmersArray) {
        var swimmers = [];
        swimmersArray.rows.forEach(function(swimmerData) {
          var swimmer = scope._retrieveInstance(swimmerData.id, swimmerData);
          swimmers.push(swimmer);
        });

        deferred.resolve(swimmers);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    lookupTimes: function(asanum) {
      var deferred = $q.defer();

      $http.get(UrlService.baseUrl + '/api/asa/swimmer/' + asanum)
      .success(function(response) {
        deferred.resolve(response.times);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setSwimmer: function(swimmerData) {
      var scope = this;
      var swimmer = this._search(swimmerData.id);
      if (swimmer) {
        swimmer.setData(swimmerData);
      } else {
        swimmer = scope._retrieveInstance(swimmerData);
      }
      return swimmer;
    }
  };
  return SwimmerFactory;
}]);

app.factory('Swimmer', ['$http', 'UrlService', 'Config', function($http, UrlService, Config) {
  function Swimmer(swimmerData) {
    if (swimmerData) {
      this.setData(swimmerData);
    }
  };
  Swimmer.prototype = {
    setData: function(swimmerData) {
      angular.extend(this, swimmerData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/swimmers/delete/' + id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/swimmers/save', this);
    },
    dateOfBirth: function() {
      if (!this.dob) {
        return false;
      }
      return moment(this.dob, "YYYY-MM-DD").format("D MMM YYYY");
    },
    getBestTime: function(raceType) {
      var race = Config.races[raceType];

      for(indx in this.swim_times) {
        var time = this.swim_times[indx];
        if(time.course_type == race.course_type &&
          time.distance == race.distance &&
          time.stroke == race.stroke
        ) {
          return time;
        }
      }

      return "99:59.99";
    }
  };
  return Swimmer;
}]);

app.directive('swimmer', function ($filter) {
  return {
    replace: true,
    templateUrl: 'app/components/swimmers/swimmer-basic.html',
    link: function ($scope, element, attrs) {
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
})
