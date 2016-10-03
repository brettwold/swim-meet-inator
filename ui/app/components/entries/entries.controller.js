angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, ConfigData) {

  var menu = { title: "Entry management" };
  var status = $route.current.status;
  var config, entries;

  angular.extend(this, {
    config: config,
    entries: entries,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      EntryFactory.loadEntries().then(function(entries) {
        console.log(entries);
        self.entries = entries;
      });
    }
  });

  this.init();
}
