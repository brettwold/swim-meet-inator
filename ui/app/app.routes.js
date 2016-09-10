angular
  .module('SwimResultinator')
  .config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  }).factory('AuthService', ['$http', 'SessionService',

    function($http, SessionService) {
      var AuthService = {

        login: function(callback) {
          $http({ method: 'GET', url: '/api' })
            .success(function(data, status, headers, config) {
              SessionService.authenticated = true;
              console.log("Got user: " + data);
              SessionService.user = data;
              if (typeof(callback) === typeof(Function)) callback();
            })
            .error(function(data, status, headers, config) {
              console.log('Error authenticating');
              SessionService.authenticated = false;
              if (typeof(callback) === typeof(Function)) callback();
            });
        }
      };

      return AuthService;
    }
  ]).factory('SessionService', function() {
    return {
      user: null,
      authenticated: false
    };
  });;
