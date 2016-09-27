angular
  .module('SwimResultinator')
  .factory('UrlService', function($location) {
    return {
        baseUrl : 'http://' + $location.host() + ':3456'
    };
  })
  .factory('ConfigData', function($http, $q) {
    var swimdata;
    return {
      getConfig: function() {
        var data = $q.defer();
        if(!swimdata) {
          $http.get('/api/swimdata')
            .success(function (response) {
              swimdata = response;
              data.resolve(response);
            })
            .error(function (response) {
              data.reject(response);
            });
        } else {
          data.resolve(swimdata);
        }
        return data.promise;
      }
    };
  });

  angular.module('SwimResultinator').config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD-MMM-YYYY');
    };
  });
