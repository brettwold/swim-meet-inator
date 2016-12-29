var app = angular.module('SwimResultinator')

app.factory('UserFactory', ['$http', '$q', 'Swimmer', 'UrlService', function($http, $q, Swimmer, UrlService) {
  var UserFactory = {

    lookupBestTimes: function(asanum) {

    },
    lookupStrokeTimes: function(asanum) {
      
    },
    addSwimmer: function(swimmer) {

    },
    removeSwimmer: function(swimmer) {

    }
  };
  return UserFactory;
}]);
