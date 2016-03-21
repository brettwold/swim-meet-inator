angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/meets', {
          templateUrl: 'partials/meets.html',
          controller: 'MeetCtrl'
        }).
        when('/meets/edit/:id?', {
          templateUrl: 'partials/meets-edit.html',
          controller: 'MeetCtrl'
        });
    }]);
