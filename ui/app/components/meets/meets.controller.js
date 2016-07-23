angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('meets', 'meet', MeetCtrl);
  });

function MeetCtrl($scope, $location, $route, $routeParams, MeetFactory, Meet, TimesheetFactory, ConfigData) {

  $scope.menu = { title: "Meet management" };
  $scope.status = $route.current.status;

  $scope.navigateTo = function(to, event) {
    $location.path('/meets' + to);
  };

  $scope.getAll = function() {
    MeetFactory.loadMeets().then(function(result) {
      $scope.meets = result;
    });
  };

  $scope.add = function() {
    $scope.navigateTo('/edit');
  };

  $scope.save = function() {
    $scope.status_message = "";
    $scope.meet.update().then(function(response) {
      if(response.status == 200) {
        $scope.status_message = "Meet saved";
      } else {
        $scope.status_message = "Error saving meet";
      }
    })
  };

  $scope.delete = function(id) {
    MeetFactory.delete(id);
    $scope.getAll();
  };

  $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };

  $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);
    else list.push(item);
  };

  if($scope.status == 'list') {
    $scope.menu.title = "Meet management";
  } else if($scope.status == 'edit') {
    if($scope.meet && $scope.meet.id) {
      $scope.menu.title = "Edit meet";
    } else {
      $scope.menu.title = "Create new meet";
    }
  }

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    if($routeParams.id) {
      MeetFactory.getMeet($routeParams.id).then(function(response) {
        $scope.meet = response;
      });
    } else {
      $scope.meet = new Meet({});
    }

    TimesheetFactory.loadTimesheets().then(function(result){
      $scope.timesheets = result;
    });
  }

  init();
}
