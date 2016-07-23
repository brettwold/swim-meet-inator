angular
  .module('SwimResultinator')
  .factory('UrlService', function($location) {
    return {
        baseUrl : 'http://' + $location.host() + ':3456'
    };
  })
  .factory('ConfigData', function($location) {
    return {
      var data = $q.defer();
      $http.get('/javascripts/config.json')
        .success(function (response) {
          console.log("Got fconfig balhahah: " + response);
          data.resolve(response);
        })
        .error(function (response) {
          data.reject(response);
        });
      return data.promise;
    };
  });
