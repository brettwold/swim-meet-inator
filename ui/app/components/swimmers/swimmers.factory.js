var app = angular.module('SwimResultinator')

app.factory('SwimmerFactory', ['$http', '$q', 'Swimmer', 'UrlService', 'ObjectPool', function($http, $q, Swimmer, UrlService, ObjectPool) {
  var SwimmerFactory = {
    pool: new ObjectPool('/swimmers', Swimmer, 'swimmers'),
    _searchByRegNo: function(regno) {
      for(swimmer in this.pool.current()) {
        if(swimmer.regno == regno) {
          return swimmer;
        }
      }
    },
    getSwimmer: function(swimmerId) {
      return this.pool.get(swimmerId);
    },
    getSwimmerByRegNo: function(regno) {
      var swimmer = this._searchByRegNo(regno);
      if (swimmer && swimmer.swim_times) {
        var deferred = $q.defer();
        deferred.resolve(swimmer);
        return deferred.promise;
      } else {
        return this.pool.load('/swimmers/regno/' + swimmerId);
      }
    },
    loadSwimmers: function() {
      return this.pool.load();
    },
    lookupTimes: function(asanum) {
      var deferred = $q.defer();
      $http.get(UrlService.baseUrl + '/asa/swimmer/' + asanum).success(function(response) {
        deferred.resolve(response.times);
      }).error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setSwimmer: function(swimmerData) {
      return this.pool.set(swimmerData);
    },
    removeSwimmer: function(swimmer) {
      this.pool.remove(swimmer);
    }
  };
  return SwimmerFactory;
}]);

app.factory('Swimmer', ['$http', '$q', 'UrlService', 'ConfigData', function($http, $q, UrlService, ConfigData) {
  function Swimmer(swimmerData) {
    if (swimmerData) {
      this.setData(swimmerData);
    }
    ConfigData.getConfig().then(function(data) {
      this.config = data;
    });
  };
  Swimmer.prototype = {
    setData: function(swimmerData) {
      angular.extend(this, swimmerData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/swimmers/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/swimmers/save', this);
    },
    addToUser: function() {
      return $http.put(UrlService.baseUrl + '/swimmers/addtouser/' + this.id);
    },
    removeFromUser: function() {
      return $http.put(UrlService.baseUrl + '/swimmers/removefromuser/' + this.id);
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
        $http.get(UrlService.baseUrl + '/swimtimes/best/' + this.id + '/' + qualDate)
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

app.directive('swimmer', ['ConfigData', 'Swimmer', function (ConfigData, Swimmer) {

  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'app/components/swimmers/swimmer-basic.html',
    scope: {
      'swimmer' : '='
    },
    link: function ($scope, element, attrs) {
      ConfigData.getConfig().then(function(data) {
        $scope.config = data;
      });
    }
  };
}])
