(function() {

  var app = angular.module('ghLite');

  app.controller('HomeController', ['$scope', '$state', function($scope, $state) {
    $scope.userName = '';
    $scope.onSubmit = onSubmit;

    debugger

    function onSubmit(e) {
      $state.go('user_details', { username: $scope.userName });
    }
  }]);

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
    fn
  ];

  app.controller('RepoDetailsController', definition);

  function fn($scope, $stateParams, gh, ds, user) {
    var 
      repo;

    repo = ds.get('repos')[$stateParams.repo_name];

    $scope.repo = repo;
    $scope.languages = _.map(repo.languages, function mapLanguages(size, name) {
      return {
        name: name,
        size: size
      };
    });

    showLanguagesChart  ();

    function showLanguagesChart () {
      var 
        data = getPieData(),
        chart;

      chart = c3.generate({
        bindto: document.querySelector('#languagesChart'),
        data: {
          columns: data,
          type : 'donut'
        },
        donut: {
          title: "Languages"
        }
      });
    }

    function getPieData() {
      var cols = [];
      _.each($scope.languages, function formatForPie(lang) {
        cols.push([lang.name, lang.size]);
      });

      return cols;
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
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds) {
    var
      user = targetUser.get();

    $scope.detailsUrl = detailsUrl;
    
    if (ds.exists('repos')) {
      showUserRepos(ds.get('repos'));
    }
    else {
      gh.getUserRepos(user.username)
        .then(showUserRepos)
        .catch(showReposError);
    }

    function showUserRepos(repos) {
      $scope.repos = repos;
      ds.set('repos', repos);
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }
  }

})();