(function() {
  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    '$stateParams',
    'githubApi',
    'dataStore',
    'targetUser',
    fn
  ];

  app.controller('RepoDetailsController', definition);

  function fn($scope, $stateParams, gh, ds, user) {
    var 
      repo;

    repo = ds.get('repos')[$stateParams.repo_name];

    $scope.repo = repo;
    $scope.languages = _.map(repo.languages, mapLanguages);
    $scope.commits = _.map(repo.commits, mapCommits);

    function mapLanguages(size, name) {
      return {
        name: name,
        size: size
      };
    }

    function mapCommits(commit) {
      return commit.commit;
    }
  }
})();