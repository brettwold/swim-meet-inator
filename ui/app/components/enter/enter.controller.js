const enterpathprefix = '/app/components/enter';
const enterbase = '/enter';
angular
  .module('SwimResultinator')
  .controller('EnterCtrl', EnterCtrl)
  .config(function($routeProvider) {
    $routeProvider
    .when(enterbase, {
      templateUrl: enterpathprefix + "/enter.html",
      controller: EnterCtrl
    });
  });

function EnterCtrl($scope, $location, $route, $routeParams, EntryFactory, Entry, MeetFactory, SwimmerFactory, ConfigData) {

  var ctrl = this;
  ctrl.menu = { title: "Enter a Meet" };
  ctrl.swimmer;
  ctrl.meetId;
  ctrl.raceEntries;

  ctrl.navigateTo = function(to, event) {
    $location.path('/enter' + to);
  };

  ctrl.moveToNext = function() {
    ctrl.message = '';
    // console.log(ctrl.swimmer);
    // console.log(ctrl.meetId);
    console.log(ctrl.raceEntries);
    if(!ctrl.swimmer && ctrl.asaregno) {
      SwimmerFactory.getSwimmerByRegNo(ctrl.asaregno).then(function(swimmer) {
        ctrl.swimmer = swimmer;
      }, function(error) {
        ctrl.message = 'Failed to find swimmer: ' + error;
      });
    } else if(ctrl.swimmer && ctrl.meetId && ctrl.raceEntries) {
      var entry = new Entry();
      entry.swimmer = ctrl.swimmer;
      entry.meet = ctrl.meet;
      entry.race_types_arr = ctrl.raceEntries;
      for(i = 0; i < entry.race_types_arr; i++) {
        var time = ctrl.swimmer.getBestTime(entry.race_types_arr[i]);
        entry.addEntryTime(time);
      }

      ctrl.entry = entry;
    }
  }

  $scope.$watch(
    function watchMeet(scope) {
        return( ctrl.meetId );
    },
    function handleMeetChange(newVal, oldVal) {
      if(newVal) {
        MeetFactory.getMeet(newVal).then(function(meet) {
          ctrl.meet = meet;
        });
      }
    }
  );

  function init() {
    ConfigData.getConfig().then(function(data) {
      ctrl.config = data;
    });

    MeetFactory.loadCurrentMeets().then(function(meets) {
      ctrl.meets = meets;
    });

    ctrl.raceEntries = new Array()
  }
  init();
}
