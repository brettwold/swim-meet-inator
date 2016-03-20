angular
  .module('SwimResultinator')
  .controller('MeetCtrl', MeetCtrl);

function MeetCtrl($scope, $http, $location, UrlService) {
  $scope.getAll = function() {
    $http.get(UrlService.baseUrl + '/api/meets').then(function(response) {
      $scope.meets = response.data;
    });
  };

  $scope.navigateTo = function(to, event) {
      $location.path('/meets' + to);
  };

  $scope.get = function(id) {
    $http.get(UrlService.baseUrl + '/api/meets/' + id).then(function(response) {
      $scope.meet = response.data;
    });
  };

  $scope.save = function() {
    console.log("Saving: " + JSON.stringify($scope.meet));
    $http.post(UrlService.baseUrl + '/api/meets/add', $scope.meet).then(function(response) {
      $scope.meet = response.data;
    });
  }

  $scope.meet = {};
  $scope.meet_types = ["Level 1", "Level 2", "Level 3", "Level 4"];
  $scope.lanes = ["6", "8", "10"];
}
