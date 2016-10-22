var app = angular.module('SwimResultinator')

app.factory('EntryFactory', ['$http', '$q', 'Entry', 'UrlService', function($http, $q, Entry, UrlService) {
  var EntryFactory = {
    _pool: {},
    _retrieveInstance: function(entryId, entryData) {
      var instance = this._pool[entryId];

      if (instance) {
        instance.setData(entryData);
      } else {
        instance = new Entry(entryData);
        this._pool[entryId] = instance;
      }

      return instance;
    },
    _search: function(entryId) {
      return this._pool[entryId];
    },
    _load: function(entryId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/entries/' + entryId)
      .success(function(entryData) {
        var entry = scope._retrieveInstance(entryData.id, entryData);
        deferred.resolve(entry);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getEntry: function(entryId) {
      var deferred = $q.defer();
      var entry = this._search(entryId);
      if (entry) {
        deferred.resolve(entry);
      } else {
        this._load(entryId, deferred);
      }
      return deferred.promise;
    },
    loadEntries: function(meetId) {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/entries/meet/' + meetId).success(function(entriesArray) {
        var entries = [];
        if(entriesArray) {
          entriesArray.forEach(function(entryData) {
            var entry = scope._retrieveInstance(entryData.id, entryData);
            entries.push(entry);
          });
        } else {
          console.log("No entries for meet");
        }

        deferred.resolve(entries);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setEntry: function(entryData) {
      var scope = this;
      var entry = this._search(entryData.id);
      if (entry) {
        entry.setData(entryData);
      } else {
        entry = scope._retrieveInstance(entryData);
      }
      return entry;
    }
  };
  return EntryFactory;
}]);

app.factory('Entry', ['$http', 'UrlService', function($http, UrlService) {
  function Entry(entryData) {
    if (entryData) {
      this.setData(entryData);
    }
  };
  Entry.prototype = {
    setData: function(entryData) {
      angular.extend(this, entryData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/entries/delete/' + id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/entries/save', this);
    }
  };
  return Entry;
}]);

app.directive('entrySummary', function ($filter) {
  return {
    replace: true,
    templateUrl: 'app/components/entries/entry-summary.html',
    scope: {
      'entry' : '=',
      'meet' : '=',
      'swimmer' : '='
    },
    controller: EntryCtrl,
    controllerAs: 'ctrl',
    bindToController: true,
    link: function ($scope, element, attrs, ctrl) {
      // $scope.$watch('entryId', function(newVal, oldVal) {
      //   var EntryFactory = element.injector().get('EntryFactory');
      //   if(newVal) {
      //     EntryFactory.getEntry(newVal).then(function(entry) {
      //       $scope.entry = entry;
      //     });
      //   }
      // });
    }
  };
})
