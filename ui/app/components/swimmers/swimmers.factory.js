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
    _searchByRegNo: function(regno) {
      for(swimmer in this._pool) {
        if(swimmer.regno == regno) {
          return swimmer;
        }
      }
    },
    _load: function(swimmerId, deferred, byRegno) {
      var scope = this;

      var getUrl = UrlService.baseUrl + '/api/swimmers/' + swimmerId;

      if(byRegno) {
        getUrl = UrlService.baseUrl + '/api/swimmers/regno/' + swimmerId;
      }

      $http.get(getUrl)
        .success(function(swimmerData) {
          if(swimmerData) {
            var swimmer = scope._retrieveInstance(swimmerData.id, swimmerData);
            deferred.resolve(swimmer);
          } else {
            deferred.reject("No swimmer data found");
          }
        }).catch(function(e) {
          deferred.reject(e.statusText);
        });
    },
    getSwimmer: function(swimmerId) {
      var deferred = $q.defer();
      var swimmer = this._search(swimmerId);
      if (swimmer && swimmer.swim_times) {
        deferred.resolve(swimmer);
      } else {
        this._load(swimmerId, deferred);
      }
      return deferred.promise;
    },
    getSwimmerByRegNo: function(regno) {
      var deferred = $q.defer();
      var swimmer = this._searchByRegNo(regno);
      if (swimmer && swimmer.swim_times) {
        deferred.resolve(swimmer);
      } else {
        this._load(regno, deferred, true);
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
    },
    removeSwimmer: function(swimmer) {
      delete this._pool[swimmer.id];
    }
  };
  return SwimmerFactory;
}]);

app.factory('Swimmer', ['$http', '$q', 'UrlService', 'ConfigData', function($http, $q, UrlService, ConfigData) {
  var config;
  ConfigData.getConfig().then(function(data) {
    config = data;
  });

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
      return $http.get(UrlService.baseUrl + '/api/swimmers/delete/' + this.id);
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
    getTimesByCourseType: function(course_type) {
      var times = [];
      for(indx in this.swim_times) {
        var time = this.swim_times[indx];
        if(course_type == config.races[time.race_type].course_type) {
          times.push(time);
        }
      }
      return times;
    },
    getBestTimes: function(qualDate) {
      var deferred = $q.defer();
      if(qualDate) {
        $http.get(UrlService.baseUrl + '/api/swimtimes/best/' + this.id + '/' + qualDate)
          .success(function(swimTimes) {
            if(swimTimes) {
              deferred.resolve(swimTimes);
            } else {
              deferred.reject("No swimmer times found");
            }
          }).catch(function(e) {
            deferred.reject(e.statusText);
          });
      } else {
        deferred.resolve(this.swim_times);
      }

      return deferred.promise;
    }
  };
  return Swimmer;
}]);

app.directive('swimmer', ['ConfigData', function (ConfigData) {

  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'app/components/swimmers/swimmer-basic.html',
    scope: {
      'swimmerId' : '='
    },
    link: function ($scope, element, attrs) {
      ConfigData.getConfig().then(function(data) {
        $scope.config = data;
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
}])
