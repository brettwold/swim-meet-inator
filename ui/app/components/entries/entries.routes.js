angular
  .module('SwimResultinator')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/entries/:meetId', {
          templateUrl: 'partials/entries.html',
          controller: 'EntryCtrl',
          status: 'list'
        }).
        when('/entries/:meetId/:id?', {
          templateUrl: 'partials/entry-edit.html',
          controller: 'EntryCtrl',
          status: 'edit'
        });
    }]);
