angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/swimmers', {
          templateUrl: 'partials/swimmers.html',
          controller: 'SwimmersCtrl',
          status: 'list'
        }).
        when('/swimmers/:id?', {
          templateUrl: 'partials/swimmer-edit.html',
          controller: 'SwimmersCtrl',
          status: 'edit'
        });
    }]);
