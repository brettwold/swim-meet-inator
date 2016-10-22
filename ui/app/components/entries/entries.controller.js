angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, Swimmer, ConfigData) {

  angular.extend(this, {
    menu: { title: "Entry management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      MeetFactory.loadCurrentMeets().then(function(meets) {
        self.meets = meets;
      });

      if($routeParams.id) {
        EntryFactory.getEntry($routeParams.id).then(function(entry) {
          self.entry = entry;
          self.entry.swimmer = new Swimmer(self.entry.swimmer);
          self.meetId = entry.meet_id;
          MeetFactory.getMeet(self.meetId).then(function(meet) {
            self.meet = meet;
          });
        });
      }
    },
    navigateTo: function(to, event) {
      $location.path('/entries' + to);
    },
    selectMeet: function() {
      var self = this;
      MeetFactory.getMeet(self.meetId).then(function(meet) {
        self.meet = meet;
        EntryFactory.loadEntries(meet.id).then(function(entries) {
          console.log(entries);
          self.entries = entries;
        });
      });
    },
  });

  this.init();
}
