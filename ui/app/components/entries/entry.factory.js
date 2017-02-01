var app = angular.module('SwimResultinator')

app.factory('EntryFactory', ['$http', '$q', 'Entry', function($http, $q, Entry) {
  var EntryFactory = {
    getEntry: function(entryId) {
      var deferred = $q.defer();
      $http.get('/api/entries/' + entryId).success(function(res) {
        deferred.resolve(new Entry(res.entry));
      }).error(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    loadEntries: function(meetId) {
      var deferred = $q.defer();
      $http.get('/api/entries/meet/' + meetId).success(function(res) {
        deferred.resolve(res.entries);
      }).error(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
  return EntryFactory;
}]);

app.factory('Entry', ['$http', 'UrlService', function($http, UrlService) {
  function Entry(entryData) {
    if (entryData) {
      this.setData(entryData);
    }
  }
  Entry.prototype = {
    setData: function(entryData) {
      angular.extend(this, entryData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/entries/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/entries/save', this);
    }
  }
  return Entry;
}]);

app.directive('entrySummary', function ($filter, ConfigData) {
  return {
    replace: true,
    templateUrl: 'app/components/entries/entry-summary.html',
    scope: {
      'entry' : '=',
      'meet' : '=',
      'swimmer' : '='
    },
    link: function ($scope, element, attrs, ctrl) {
      ConfigData.getConfig().then(function(data) {
        $scope.config = data;
      });
    }
  };
})
