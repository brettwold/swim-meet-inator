const pathprefix = '/app/components/';

angular
  .module('SwimResultinator')
  .provider('appRoute', [ '$routeProvider', function($routeProvider) {

    var name;
    var controller;

    this.setName = function(name, controller) {
      this.name = name;
      this.controller = controller;
      $routeProvider.
        when('/' + name + 's', {
          templateUrl: pathprefix + name + 's/' + name + 's.html',
          controller: controller,
          status: 'list'
        }).
        when('/' + name + 's/:id?', {
          templateUrl: pathprefix + name + 's/' + name + '-edit.html',
          controller: controller,
          status: 'edit'
        });
    }

    this.$get = function() {
    };
}]);
