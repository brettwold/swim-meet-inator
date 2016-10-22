angular
  .module('SwimResultinator')
  .controller('ClubCtrl', ClubCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('clubs', 'club', ClubCtrl);
  });

function ClubCtrl($location, $route, $routeParams, ClubFactory, Club, SwimmerFactory, ConfigData) {

  angular.extend(this, {
    menu: { title: "Club management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      if($routeParams.id) {
        ClubFactory.getClub($routeParams.id).then(function(response) {
          self.club = response;
          self.menu.title = "Edit club";
        });
      } else {
        self.club = new Club({});
        self.getAll();
      }

      if(self.status == 'list') {
        self.menu.title = "Club management";
      } else if(self.status == 'edit') {
        self.menu.title = "Create new club";
      }
    },
    navigateTo: function(to, event) {
      $location.path('/clubs' + to);
    },
    getAll: function() {
      var self = this;
      ClubFactory.loadClubs().then(function(result) {
        self.clubs = result;
      });
    },
    add: function() {
      this.navigateTo('/edit');
    },
    save: function() {
      this.club.update();
    },
    delete: function(id) {
      var self = this;
      var club = ClubFactory.getClub(id).then(function(club) {
        club.delete();
        ClubFactory.removeClub(club);
        self.getAll();
      });
    },
    findSwimmer: function() {
      var self = this;
      SwimmerFactory.getSwimmer($scope.asanum).then(function(response) {
        self.swimmer = response;
      });
    },
    addSwimmer: function() {
      var self = this;
      if(self.club) {
        self.swimmer.club_id = self.club.id;
        ClubFactory.addSwimmer(self.swimmer).then(function(response) {
          self.swimmer = null;
        });
      }
    },
    deleteSwimmer: function(id) {
      var self = this;
      ClubFactory.deleteSwimmer(id).then(function(response) {
        self.swimmers = response.data;
      });
    }
  });

  this.init();
}
