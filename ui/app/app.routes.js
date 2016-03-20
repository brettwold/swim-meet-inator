angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/results', {
          templateUrl: 'partials/results.html',
          controller: 'ResultCtrl'
        }).
        when('/home', {
          templateUrl: 'partials/home.html'
        }).
        otherwise({
          redirectTo: '/'
        });
    }]);
