var app = angular.module('SwimResultinator')

app.factory('UserFactory', ['User', 'ObjectPool', function(User, ObjectPool) {
  var UserFactory = {
    pool: new ObjectPool('/users', User, 'users'),
    getUser: function(userId) {
      return this.pool.get(userId);
    },
    loadUsers: function() {
      return this.pool.load();
    },
    setUser: function(userData) {
      return this.pool.set(userData);
    },
    removeUser: function(user) {
      this.pool.remove(user);
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
      return $http.get(UrlService.baseUrl + '/users/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/users/save', this);
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
