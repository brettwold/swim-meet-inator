angular
  .module('SwimResultinator')
  .factory('UrlService', function($location) {
    return {
        baseUrl : 'http://' + $location.host() + ':3456'
    };
  });
