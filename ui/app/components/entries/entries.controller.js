angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, ConfigData) {

  var menu = { title: "Entry management" };
  var status = $route.current.status;
  var config, entries, meet;

  angular.extend(this, {
    config: config,
    entries: entries,
    meet: meet,
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
          console.log(entry);
          self.entry = entry;
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
        console.log(meet);

        EntryFactory.loadEntries(meet.id).then(function(entries) {
          console.log(entries);
          self.entries = entries;
        });
      });
    },
  });

  this.init();
}
