var app = angular.module('SwimResultinator')

app.factory('ClubFactory', ['$http', '$q', 'Club', 'UrlService', function($http, $q, Club, UrlService) {
  var ClubFactory = {
    _pool: {},
    _retrieveInstance: function(clubId, clubData) {
      var instance = this._pool[clubId];

      if (instance) {
        instance.setData(clubData);
      } else {
        instance = new Club(clubData);
        this._pool[clubId] = instance;
      }

      return instance;
    },
    _search: function(clubId) {
      return this._pool[clubId];
    },
    _load: function(clubId, deferred) {
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/clubs/' + clubId)
      .success(function(clubData) {
        var club = scope._retrieveInstance(clubData.id, clubData);
        deferred.resolve(club);
      })
      .error(function() {
        deferred.reject();
      });
    },
    getClub: function(clubId) {
      var deferred = $q.defer();
      var club = this._search(clubId);
      if (club) {
        deferred.resolve(club);
      } else {
        this._load(clubId, deferred);
      }
      return deferred.promise;
    },
    loadClubs: function() {
      var deferred = $q.defer();
      var scope = this;

      $http.get(UrlService.baseUrl + '/api/clubs').success(function(clubsArray) {
        var clubs = [];
        clubsArray.rows.forEach(function(clubData) {
          var club = scope._retrieveInstance(clubData.id, clubData);
          clubs.push(club);
        });

        deferred.resolve(clubs);
      })
      .error(function() {
        deferred.reject();
      });
      return deferred.promise;
    },
    setClub: function(clubData) {
      var scope = this;
      var club = this._search(clubData.id);
      if (club) {
        club.setData(clubData);
      } else {
        club = scope._retrieveInstance(clubData);
      }
      return club;
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
      return $http.get(UrlService.baseUrl + '/api/clubs/delete/' + id);
    },
    update: function() {
      return $http.put(UrlService.baseUrl + '/api/clubs/save', this);
    }
  };
  return Club;
}]);
