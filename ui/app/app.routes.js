angular
  .module('SwimResultinator')
  .config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/home.html',
    }).when('/login', {
      templateUrl: 'partials/login.html',
    }).otherwise({
      redirectTo: '/'
    });

    $httpProvider.interceptors.push(['$rootScope', '$q', '$injector','$location', 'SessionService', function ($rootScope, $q, $injector, $location, SessionService) {
      return {
        request: function(request) {
            if ($rootScope.oauth) {
              request.headers['Authorization'] = "Bearer " + $rootScope.oauth.access_token;
            }
            return request;
        },
        response: function(response) {
          return response;
        },
        responseError: function (response) {
          if (response.status === 401 && response.data.error && response.data.error === "invalid_token") {
            var deferred = $q.defer();
            $injector.get("$http").post('/api/authenticate', {
              access_key_id: SessionService.user.access_key_id,
              access_key_secret: SessionService.user.access_key_secret
            }).then(function(loginResponse) {
              if (loginResponse && loginResponse.data) {
                $rootScope.oauth = loginResponse.data;
                $injector.get("$http")(response.config).then(function(response) {
                  deferred.resolve(response);
                }, function(response) {
                  deferred.reject();
                });
              } else {
                deferred.reject();
              }
            }, function(response) {
              deferred.reject();
              return;
            }
          );
          return deferred.promise;
        }
        return $q.reject(response);
      }
    }
  }]);

  }).factory('AuthService', ['$http', 'SessionService', 'User',

    function($http, SessionService, User) {
      var AuthService = {

        login: function(callback) {
          $http({ method: 'GET', url: '/login' })
            .success(function(data, status, headers, config) {
              SessionService.authenticated = true;
              SessionService.user = new User(data);
              console.log(SessionService.user);
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
