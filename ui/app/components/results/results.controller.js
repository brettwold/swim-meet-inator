angular
  .module('SwimResultinator')
  .controller('ResultCtrl', ResultCtrl);

function ResultCtrl($scope, $http, UrlService, MeetFactory, SwimmerFactory, ConfigData) {

  $scope.readResults = function() {
    $http.get(UrlService.baseUrl + '/api/results/' + $scope.meetId).then(function(response) {
      $scope.data = response.data;
    });
  }

  function init() {
    ConfigData.getConfig().then(function(data) {
      $scope.config = data;
    });

    MeetFactory.loadMeets().then(function(meets) {
      $scope.meets = meets;
    });

  }
  init();
}
