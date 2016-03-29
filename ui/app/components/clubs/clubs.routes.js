angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/clubs', {
          templateUrl: 'partials/clubs.html',
          controller: 'ClubCtrl',
          status: 'list'
        }).
        when('/clubs/:id?', {
          templateUrl: 'partials/club-edit.html',
          controller: 'ClubCtrl',
          status: 'edit'
        });
    }]);
