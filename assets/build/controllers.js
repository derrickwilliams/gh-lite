(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    '$state',
    'dataStore',
    fn 
  ];

  app.controller('HomeController', definition);

  function fn($scope, $state, ds) {
    $scope.username = '';
    $scope.onSubmit = onSubmit;

    function onSubmit(e) {
      ds.set('repos', undefined);
      $state.go('user_details', { username: $scope.username });
    }
  }

})();
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
    '$state',
    fn
  ];

  app.controller('RepoDetailsController', definition);

  function fn($scope, $stateParams, gh, ds, user, $state) {
    var 
      repo;

    if (!ds.exists('repos')) {
      $state.go('home');
      return;
    }

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
(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    'githubApi',
    '$stateParams',
    'targetUser',
    'dataStore',
    fn
  ];

  app.controller('UserDetailsController', definition);

  function fn($scope, gh, $stateParams, targetUser, ds) {
    $scope.username = $stateParams.username;

    gh.getUserData($scope.username)
      .then(displayUserData)
      .catch(displayError);

    function displayUserData(userData) {
      $scope.userData = userData;
      targetUser.set($scope.userData);
    }

    function displayError(err) {
      console.log('ERROR', err);
    }
  }

})();
(function() {

  var app = angular.module('ghLite');

  app.controller('UserOrgsController', ['$scope', function($scope) {
    console.log('user orgs');
  }]);

})();
(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    'targetUser',
    'githubApi',
    'dataStore',
    'stats',
    '$state',
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds, stats, $state) {
    var
      user = targetUser.get(),
      loading = true;

    if (!user) {
      $state.go('home');
      return;
    }

    $scope.detailsUrl = detailsUrl;
    $scope.isLoading = isLoading;

    if (ds.exists('repos')) {
      showUserRepos(ds.get('repos'));
      showRepoStats();
      setNotLoading();
    }
    else {
      gh.getUserRepos(user.username)
        .then(showUserRepos)
        .then(showRepoStats)
        .then(setNotLoading)
        .catch(showReposError);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }

    function isLoading() {
      return loading === true;
    }

    function showUserRepos(repos) {
      $scope.repos = repos;
      ds.set('repos', repos);
    }

    function showRepoStats() {
      var 
        bar = getBarData();

      chart = c3.generate({
        bindto: document.querySelector('#languagesStats'),
        data: {
          columns: [bar.data],
          type : 'bar'
        },
        axis: {
          x: {
            type: 'category',
            categories: bar.names
          }
        }
      });
    }

    function setNotLoading() {
      loading = false;
    }

    function getBarData() {
      var 
        names = [],
        data = ['Size'];

      _.each(stats.totalLanguageStats($scope.repos), function(total, name) {
        names.push(name);
        data.push(total);
      });

      return { names: names, data: data };
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    
  }

})();