var app = angular.module('DidTheyWin', ['ngAnimate', 'angucomplete']);

app.controller('MainCtrl', function($scope, $http) {
  $scope.result = null;
  $scope.team = '';
  $scope.entrance = null;
  $scope.team_names = [
    {'name': 'Atlanta Hawks'},
    {'name': 'Boston Celtics'},
    {'name': 'Brooklyn Nets'},
    {'name': 'Charlotte Bobcats'},
    {'name': 'Chicago Bulls'},
    {'name': 'Cleveland Cavaliers'},
    {'name': 'Dallas Mavericks'},
    {'name': 'Denver Nuggets'},
    {'name': 'Detroit Pistons'},
    {'name': 'Golden State Warriors'},
    {'name': 'Houston Rockets'},
    {'name': 'Indiana Pacers'},
    {'name': 'Los Angeles Clippers'},
    {'name': 'Los Angeles Lakers'},
    {'name': 'Memphis Grizzlies'},
    {'name': 'Miami Heat'},
    {'name': 'Milwaukee Bucks'},
    {'name': 'Minnesota Timberwolves'},
    {'name': 'New Orleans Hornets'},
    {'name': 'New York Knicks'},
    {'name': 'Oklahoma City Thunder'},
    {'name': 'Orlando Magic'},
    {'name': 'Philadelphia Sixers'},
    {'name': 'Phoenix Suns'},
    {'name': 'Portland Trail Blazers'},
    {'name': 'Sacramento Kings'},
    {'name': 'San Antonio Spurs'},
    {'name': 'Toronto Raptors'},
    {'name': 'Utah Jazz'},
    {'name': 'Washington Wizards'}
  ];

  $scope.submit_form = function() {
    $scope.entrance = true;
    $scope.result = null;
    $scope.$broadcast('resetSearchStr');
    $scope.loadData($scope.team.originalObject.name);
  };

  $scope.loadData = function(team) {
    $http({
      method: 'POST',
      url:    '/',
      data:   'team=' + team,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      $scope.result = data;
      $scope.team = '';
    });
  };

  $scope.build_player_picture_url = function(player_name) {
    url_name = player_name.replace(/ /g,"_");
    return "http://i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/" + url_name + ".png";
  };
});
