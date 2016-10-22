angular
  .module('SwimResultinator')
  .controller('UsersCtrl', UsersCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('users', 'user', UsersCtrl);
  });

function UsersCtrl($scope, $location, $route, $routeParams, UserFactory, User, ConfigData) {

  angular.extend(this, {
    menu: { title: "User management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      if($routeParams.id) {
        UserFactory.getUser($routeParams.id).then(function(user) {
          self.user = user;
          self.menu.title = "Edit user";
        });
      } else {
        self.user = new User({});
        self.getAll();
      }

      if(self.status == 'list') {
        self.menu.title = "User management";
      } else if($scope.status == 'edit') {
        self.menu.title = "Create new user";
      }
    },
    navigateTo: function(to, event) {
      $location.path('/users' + to);
    },
    getAll: function() {
      var self = this;
      UserFactory.loadUsers().then(function(users) {
        self.users = users;
      });
    },
    add: function() {
      this.navigateTo('/edit');
    },
    save: function() {
      this.user.update();
    },
    delete: function(id) {
      var self = this;
      var user = UserFactory.getUser(id).then(function(user) {
        user.delete();
        UserFactory.removeUser(user);
        self.getAll();
      });
    }
  });


  this.init();
}
