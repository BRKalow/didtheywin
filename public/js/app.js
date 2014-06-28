var app = angular.module('DidTheyWin', ['ngAnimate']);

app.controller('MainCtrl', function($scope, $http) {
  $scope.result = null;
  $scope.team = '';
  $scope.entrance = null;

  $scope.submit = function() {
    $scope.entrance = true;
    $scope.result = null;
    $scope.loadData(this.team);
    $scope.team = '';
  };

  $scope.loadData = function(team) {
    $http({
      method: 'POST',
      url:    '/',
      data:   'team=' + team,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      $scope.result = data;
    });
  };
});
