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

      if(self.meetId) {
        MeetFactory.getMeet(self.meetId).then(function(meet) {
          self.meet = meet;
          self._loadEntries(meet);
        });
      }

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
    _loadEntries: function(meet) {
      var self = this;
      EntryFactory.loadEntries(meet.id).then(function(entries) {
        self.entries = entries;
      });
    },
    navigateTo: function(to, event) {
      $location.path('/entries' + to);
    },
    selectMeet: function() {
      this.init();
    },
    delete: function(id) {
      var self = this;
      EntryFactory.getEntry(id).then(function(entry) {
        entry.delete();
        self._loadEntries(self.meet);
      });
      this.init();
    },
  });

  this.init();
}
