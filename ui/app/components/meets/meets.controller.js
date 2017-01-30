angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl)
  .config(function(appRouteProvider) {
    appRouteProvider.setName('meets', 'meet', MeetCtrl);
  });

function MeetCtrl($location, $route, $routeParams, MeetFactory, Meet, TimesheetFactory, ConfigData) {

  angular.extend(this, {
    menu: { title: "Meet management" },
    status: $route.current.status,
    init: function() {
      var self = this;
      ConfigData.getConfig().then(function(data) {
        self.config = data;
      });

      if($routeParams.id) {
        MeetFactory.getMeet($routeParams.id).then(function(response) {
          self.meet = response;
        });
      } else {
        MeetFactory.loadMeets().then(function(result) {
          self.meets = result;
        });
        self.meet = new Meet();
      }

      TimesheetFactory.loadTimesheets().then(function(result){
        self.timesheets = result;
      });
    },
    navigateTo: function(to, event) {
      $location.path('/meets' + to);
    },
    add: function() {
      this.navigateTo('/edit');
    },
    save: function() {
      var self = this;
      self.status_message = "";
      self.meet.update().then(function(response) {
        if(response.status == 200) {
          self.status_message = "Meet saved";
        } else {
          self.status_message = "Error saving meet";
        }
      })
    },
    delete: function(id) {
      MeetFactory.getMeet(id).then(function(meet) {
        meet.delete();
        MeetFactory.removeMeet(meet);
      });
      this.init();
    },
    exists: function (item, list) {
      return list.indexOf(item) > -1;
    },
    toggle: function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
    },
    checkEventsAndGroups: function() {
      console.log("checkEventsAndGroups");
      this.meet.checkEventsAndGroups();
    }
  });

  this.init();
}
