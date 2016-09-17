angular
  .module('SwimResultinator')
  .controller('EntryCtrl', EntryCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('entries', 'entry', EntryCtrl);
  });

function EntryCtrl($scope, $location, $route, $routeParams, EntryFactory, MeetFactory, SwimmerFactory, ConfigData) {

  $scope.menu = { title: "Entry management" };
  $scope.status = $route.current.status;
  $scope.meet;
  $scope.swimmer;

  $scope.navigateTo = function(to, event) {
    $location.path('/entries' + to);
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    $scope.status_message = "";
    if($scope.swimmer_id && $scope.meet_id) {
      var newEntry = EntryFactoyr.setEntry({swimmer_id: $scope.swimmer_id, meet_id: $scope.meet_id});
      newEntry.update().then(function(response) {
        if(response.status == 200) {
          $scope.status_message = "Entry saved";
        } else {
          $scope.status_message = "Error saving entry";
        }
      });
    }
  };

  $scope.getAll = function() {
    EntryFactory.loadEntries().then(function(entries) {
      $scope.entries = entries;
    });
  };

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($scope.status == 'list') {
      $scope.menu.title = "Entry management";
    } else if($scope.status == 'edit') {
      MeetFactory.loadMeets().then(function(meets) {
        $scope.meets = meets;
      });
      SwimmerFactory.loadSwimmers().then(function(swimmers) {
        $scope.swimmers = swimmers;
      });
      if($scope.entry) {
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
  init();
}
