angular
  .module('SwimResultinator')
  .controller('SwimmersCtrl', SwimmersCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('swimmers', 'swimmer', SwimmersCtrl);
  });

function SwimmersCtrl($location, $route, $routeParams, SwimmerFactory, Swimmer, ConfigData) {

  angular.extend(this, {
    menu: { title: "Swimmer management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      if($routeParams.id) {
        SwimmerFactory.getSwimmer($routeParams.id).then(function(swimmer) {
          self.swimmer = swimmer;
          self.menu.title = "Edit swimmer";
        });
      } else {
        self.swimmer = new Swimmer({});
        self.getAll();
      }

      if(self.status == 'list') {
        self.menu.title = "Swimmer management";
      } else if(self.status == 'edit') {
        self.menu.title = "Create new swimmer";
      }
    },
    navigateTo: function(to, event) {
      $location.path('/swimmers' + to);
    },
    getAll: function() {
      var self = this;
      SwimmerFactory.loadSwimmers().then(function(swimmers) {
        self.swimmers = swimmers;
      });
    },
    add: function() {
      this.navigateTo('/edit');
    },
    save: function() {
      this.swimmer.update();
    },
    delete: function(id) {
      var self = this;
      var swimmer = SwimmerFactory.getSwimmer(id).then(function(swimmer) {
        swimmer.delete();
        SwimmerFactory.removeSwimmer(swimmer);
        self.getAll();
      });
    },
    lookupTimes: function() {
      var self = this;
      self.swimmer.update();
      SwimmerFactory.lookupTimes(self.swimmer.regno).then(function(times) {
        self.swimmer.SwimTimes = times;
        SwimmerFactory.setSwimmer(self.swimmer);
      });
    }
  });

  this.init();
}
