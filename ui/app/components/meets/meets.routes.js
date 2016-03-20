angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/meets', {
          templateUrl: 'partials/meets.html',
          controller: 'MeetCtrl'
        }).
        when('/meets/add', {
          templateUrl: 'partials/meets-add.html',
          controller: 'MeetCtrl'
        });
    }]);
