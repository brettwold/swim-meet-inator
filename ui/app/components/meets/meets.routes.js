angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/meets', {
          templateUrl: 'partials/meets.html',
          controller: 'MeetCtrl',
          status: 'list'
        }).
        when('/meets/edit/:id?', {
          templateUrl: 'partials/meets-edit.html',
          controller: 'MeetCtrl',
          status: 'edit'
        });
    }]);
