var app = angular.module('SwimResultinator');
app.service('ObjectPool', function($http, $q, UrlService) {
  function ObjectPool(url, objectType, pluralName) {
    this.url = url;
    this.objectType = objectType;
    this.pluralName = pluralName;
  }
  ObjectPool.prototype = {
    _pool: {},
    _retrieveInstance: function(objectId, objectData) {
      var instance = this._pool[objectId];

      if (instance) {
        instance.setData(objectData);
      } else {
        instance = new this.objectType(objectData);
        this._pool[objectId] = instance;
      }

      return instance;
    },
    _search: function(objectId) {
      return this._pool[objectId];
    },
    _load: function(objectId, deferred) {
      var self = this;

      $http.get(UrlService.baseUrl + this.url + '/' + objectId).success(function(objectData) {
        var object = self._retrieveInstance(objectData.id, objectData);
        deferred.resolve(object);
      }).error(function() {
        deferred.reject();
      });
    },
    get: function(objectId) {
      var deferred = $q.defer();
      var object = this._search(objectId);
      if (object) {
        deferred.resolve(object);
      } else {
        this._load(objectId, deferred);
      }
      return deferred.promise;
    },
    current: function() {
      return this._pool;
    },
    load: function(uri) {
      var deferred = $q.defer();
      var self = this;
      var url = UrlService.baseUrl + this.url;
      if(uri) {
        UrlService.baseUrl + uri;
      }

      $http.get(url).success(function(res) {
        var objectsArray = res[self.pluralName];
        var objects = [];
        objectsArray.forEach(function(objectData) {
          var object = self._retrieveInstance(objectData.id, objectData);
          objects.push(object);
        });

        deferred.resolve(objects);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    set: function(objectData) {
      var self = this;
      var object = this._search(objectData.id);
      if (object) {
        object.setData(objectData);
      } else {
        object = self._retrieveInstance(objectData);
      }
      return object;
    },
    remove: function(object) {
      delete this._pool[object.id];
    }
  }
  return ObjectPool;
});
