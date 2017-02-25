angular
  .module('SwimResultinator').factory('UrlService', function($location) {
    return {
        baseUrl : 'http://' + $location.host() + ':3456/api/v1'
    };
  }).factory('ConfigData', function($http, $q, UrlService) {
    var swimdata;
    return {
      getConfig: function() {
        var data = $q.defer();
        if(!swimdata) {
          $http.get(UrlService.baseUrl + '/swimdata')
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
  }).config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD-MMM-YYYY');
    };
  });
