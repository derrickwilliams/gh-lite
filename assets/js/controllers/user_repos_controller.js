(function() {

  var app = angular.module('ghLite');

  app.controller('UserReposController', ['$scope', 'targetUser', 'githubApi', function($scope, targetUser, gh) {
    var
      user = targetUser.get();

    $scope.detailsUrl = detailsUrl;
    
    gh.getUserRepos(user.username)
      .then(showUserRepos)
      .catch(showReposError);

    function showUserRepos(repos) {
      $scope.repos = repos;
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }
  }]);

})();