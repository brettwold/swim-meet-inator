angular
  .module('SwimResultinator')
  .controller('ResultCtrl', ResultCtrl);

function ResultCtrl($scope, $http, UrlService) {
  $http.get(UrlService.baseUrl + '/api/results').then(function(response) {
    $scope.results = response.data;
  })
}
