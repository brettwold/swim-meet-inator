angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/results', {
          templateUrl: 'app/components/results/results.html',
          controller: 'ResultCtrl'
        });
    }]);
