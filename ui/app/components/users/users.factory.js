var app = angular.module('SwimResultinator')

app.factory('UserFactory', ['$http', '$q', 'User', 'UrlService', function($http, $q, User, UrlService) {
  var UserFactory = {
    _pool: {},
    _retrieveInstance: function(userId, userData) {
      var instance = this._pool[userId];

      if (instance) {
        instance.setData(userData);
      } else {
        instance = new User(userData);
        this._pool[userId] = instance;
      }

      return instance;
    },
    _search: function(userId) {
      return this._pool[userId];
    },
    _load: function(userId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/users/' + userId)
      .success(function(userData) {
        var user = scope._retrieveInstance(userData.id, userData);
        deferred.resolve(user);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getUser: function(userId) {
      var deferred = $q.defer();
      var user = this._search(userId);
      if (user) {
        deferred.resolve(user);
      } else {
        this._load(userId, deferred);
      }
      return deferred.promise;
    },
    loadUsers: function() {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/users').success(function(usersArray) {
        var users = [];
        usersArray.forEach(function(userData) {
          var user = scope._retrieveInstance(userData.id, userData);
          users.push(user);
        });

        deferred.resolve(users);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setUser: function(userData) {
      var scope = this;
      var user = this._search(userData.id);
      if (user) {
        user.setData(userData);
      } else {
        user = scope._retrieveInstance(userData);
      }
      return user;
    },
    removeUser: function(user) {
      delete this._pool[user.id];
    }
  };
  return UserFactory;
}]);

app.factory('User', ['$http', 'UrlService', function($http, UrlService) {
  function User(userData) {
    if (userData) {
      this.setData(userData);
    }
  };
  User.prototype = {
    setData: function(userData) {
      angular.extend(this, userData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/users/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/users/save', this);
    },
    fullName: function() {
      return this.first_name + ' ' + this.last_name;
    },
    isAdmin: function() {
      return this.role == "admin" || this.role == "superAdmin";
    }
  };
  return User;
}]);
