angular
  .module('SwimResultinator')
  .controller('AppCtrl', AppCtrl)
  .controller('LeftCtrl', LeftCtrl)
  .controller('MenuListCtrl', MenuListCtrl);

function AppCtrl() {

}

function LeftCtrl() {

}

function MenuListCtrl($scope, $location) {
  $scope.navigateTo = function(to, event) {
      $location.path(to);
  };
}
