angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, Config) {

  $scope.config = Config;
  $scope.menu = { title: "Entry management" };
  $scope.status = $route.current.status;
  $scope.meet;
  $scope.swimmer;
  $scope.swimmerId;
  $scope.entry = {};

  $scope.navigateTo = function(to, event) {
    $location.path('/entries' + to);
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.getAll = function() {
    EntryFactory.loadEntries().then(function(entries) {
      $scope.entries = entries;
    });
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Entry management";
  } else if($scope.status == 'edit') {
    MeetFactory.loadMeets().then(function(meets) {
      $scope.meets = meets;
    });
    SwimmerFactory.loadSwimmers().then(function(swimmers) {
      $scope.swimmers = swimmers;
    });
    if($scope.entry.id) {
      $scope.menu.title = "Edit entry";
    } else {
      $scope.menu.title = "Create new entry";
    }
  }

  if($routeParams.category) {
    MeetFactory.loadMeets($routeParams.category).then(function(response) {
      $scope.meet = response;
      EntryFactory.getAllByMeet($scope.meet.id).then(function(result) {
        $scope.entries = result.data;
      });
    });
  } else {
    EntryFactory.loadEntries().then(function(result) {
      $scope.entries = result;
    });
  };
}
