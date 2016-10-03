const enterpathprefix = '/app/components/enter';
const enterbase = '/enter';
const confirm = '/enter/confirm';
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

  var menu = { title: "Enter a Meet" };
  var swimmer, meets, config;
  var meetId;
  var raceEntries;
  var asaregno;

  angular.extend(this, {
    menu: menu,
    swimmer: swimmer,
    meets: meets,
    config: config,
    meetId: meetId,
    asaregno: asaregno,
    raceEntries: raceEntries,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      MeetFactory.loadCurrentMeets().then(function(meets) {
        self.meets = meets;
      });

      self.raceEntries = new Array();
    },
    navigateTo: function(to, event) {
      $location.path('/enter' + to);
    },
    selectMeet: function() {
      var self = this;
      MeetFactory.getMeet(self.meetId).then(function(meet) {
        self.meet = meet;
      });
    },
    confirm: function() {

    },
    moveToNext: function() {
      var self = this;
      message = '';

      if (!self.swimmer && self.asaregno) {
        SwimmerFactory.getSwimmerByRegNo(self.asaregno).then(function(swimmer) {
          self.swimmer = swimmer;
        }, function(error) {
          self.message = 'Failed to find swimmer: ' + error;
        });
      } else if (self.swimmer && self.meetId && self.raceEntries && !self.entry) {
        var entry = new Entry();
        entry.swimmer_id = self.swimmer.id;
        entry.meet_id = self.meet.id;
        entry.race_types_arr = self.raceEntries;
        for(i = 0; i < entry.race_types_arr; i++) {
          var time = swimmer.getBestTime(entry.race_types_arr[i]);
          entry.addEntryTime(time);
        }

        self.entry = entry;
      } else if (self.entry) {
        console.log("Sending entry");
        self.entry.update().then(function(response) {
          if(response.status == 200) {
            self.status_message = "Entry saved";
          } else {
            self.status_message = "Error saving meet";
          }
        });
      }
    }
  });

  this.init();
}
