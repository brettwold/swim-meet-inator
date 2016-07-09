const pathprefix = '/app/components/';

angular
  .module('SwimResultinator')
  .provider('appRoute', [ '$routeProvider', function($routeProvider) {

    var name;
    var controller;

    this.setName = function(listname, singularname, controller) {
      this.name = name;
      this.controller = controller;
      $routeProvider.
        when('/' + listname, {
          templateUrl: pathprefix + listname + '/' + listname + '.html',
          controller: controller,
          status: 'list'
        }).
        when('/' + listname + '/edit/:id?', {
          templateUrl: pathprefix + listname + '/' + singularname + '-edit.html',
          controller: controller,
          status: 'edit'
        }).
        when('/' + listname + '/category/:category?', {
          templateUrl: pathprefix + listname + '/' + listname + '.html',
          controller: controller,
          status: 'edit'
        });
    }

    this.$get = function() {
    };
}]);
