var app = angular.module('SwimResultinator')

app.factory('ClubFactory', ['Club', 'ObjectPool', function(Club, ObjectPool) {
  var ClubFactory = {
    pool: new ObjectPool('/api/clubs', Club, 'clubs'),
    getClub: function(clubId) {
      return this.pool.get(clubId);
    },
    loadClubs: function() {
      return this.pool.load();
    },
    setClub: function(clubData) {
      return this.pool.set(clubData);
    },
    removeClub: function(club) {
      this.pool.remove(club);
    }
  };
  return ClubFactory;
}]);

app.factory('Club', ['$http', 'UrlService', function($http, UrlService) {
  function Club(clubData) {
    if (clubData) {
      this.setData(clubData);
    }
  };
  Club.prototype = {
    setData: function(clubData) {
      angular.extend(this, clubData);
    },
    delete: function() {
      return $http.get(UrlService.baseUrl + '/api/clubs/delete/' + this.id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/clubs/save', this);
    }
  };
  return Club;
}]);
