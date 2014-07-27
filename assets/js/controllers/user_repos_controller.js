(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    'targetUser',
    'githubApi',
    'dataStore',
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds) {
    var
      user = targetUser.get();

    $scope.detailsUrl = detailsUrl;
    
    gh.getUserRepos(user.username)
      .then(showUserRepos)
      .catch(showReposError);

    function showUserRepos(repos) {
      $scope.repos = repos;
      ds.set('repos', groupByName(repos));
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }

    function groupByName(repos) {
      var byName = {};

      _.each(repos, function(repo) {
        byName[repo.name] = repo;
      });

      return byName;
    }
  }

})();