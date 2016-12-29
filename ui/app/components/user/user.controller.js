const userpathprefix = '/app/components/user';

angular
  .module('SwimResultinator')
  .controller('UserCtrl', UserCtrl)
  .config(function($routeProvider) {
    $routeProvider
      .when('/user', {
        templateUrl: userpathprefix + "/user.html",
        controller: UserCtrl
      })
      .when('/user/entries', {
        templateUrl: userpathprefix + "/user.html",
        controller: UserCtrl
      })
      .when('/user/swimmers', {
        templateUrl: userpathprefix + "/swimmers.html",
        controller: UserCtrl
      })
      .when('/user/entry', {
        templateUrl: userpathprefix + "/user.html",
        controller: UserCtrl
      });
  });

function UserCtrl($scope, $location, $route, $routeParams, SwimmerFactory, Swimmer, ConfigData) {

  angular.extend(this, {
    menu: { title: "User Profile" },
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      this._loadSwimmers();
    },
    _loadSwimmers: function() {
      var self = this;
      SwimmerFactory.loadUserSwimmers().then(function(swimmers) {
        console.log("Got swimmers: " + swimmers.length);
        self.swimmers = swimmers;
      });
    },
    navigateTo: function(to, event) {
      $location.path('/user' + to);
    },
    removeSwimmer: function(swimmer) {
      swimmer.removeFromUser().success(function(swimmers) {
        console.log(swimmers);
        self.swimmers = swimmers;
      });
    },
    selectSwimmer: function() {

    },
    addSwimmer: function() {
      var self = this;
      self.swimmer.update();
      self.swimmer.addToUser().success(function(swimmers) {
        console.log(swimmers);
        self.swimmers = swimmers;
      });
      self.swimmer = null;
    },
    getSwimmer: function() {
      var self = this;
      if(self.asanum) {
        SwimmerFactory.getSwimmerByRegNo(self.asanum).then(function(swimmer) {
          self.swimmer = new Swimmer(swimmer);
        });
      }
    }
  });

  this.init();
}
