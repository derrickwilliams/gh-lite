(function() {

  var app = angular.module('ghLite', ['ui.router']);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      
      .state({
        name: 'home',
        url: '/',
        templateUrl: 'assets/views/home.html',
        controller: 'HomeController'
      })

      .state({
        name: 'user_details',
        url: '/user/:username',
        templateUrl: 'assets/views/user_details.html',
        controller: 'UserDetailsController'
      })

      .state({
        name: 'user_repos',
        url: '/user/:username/repos',
        templateUrl: 'assets/views/user_repos.html',
        controller: 'UserReposController'
      })

      .state({
        name: 'repo_details',
        url: '/user/:username/repos/:repo_name',
        templateUrl: 'assets/views/repo_details.html',
        controller: function($scope, $stateParams) {
          console.log('show repo', $stateParams.repo_name);
        }
      })

      .state({
        name: 'user_orgs',
        url: '/user/:username/orgs',
        templateUrl: 'assets/views/user_orgs.html',
        controller: 'UserOrgsController'
      });

  }]);

})();
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

  var app = angular.module('ghLite');

  app.controller('UserDetailsController', ['$scope', 'githubApi', '$stateParams', 'targetUser', function($scope, gh, $stateParams, targetUser) {
    $scope.username = $stateParams.username;

    gh.getUserData($scope.username)
      .then(displayUserData)
      .catch(displayError);

    function displayUserData(userData) {
      $scope.userData = userData;
      targetUser.set($scope.userData);
      console.log('userData', $scope.userData);
    }

    function displayError(err) {
      console.log('ERROR', err);
    }
  }]);

})();
(function() {

  var app = angular.module('ghLite');

  app.controller('UserOrgsController', ['$scope', function($scope) {
    console.log('user orgs');
  }]);

})();
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
(function() {

  var app = angular.module('ghLite');

  app.factory('githubApi', ['$http', function($http) {
    var
      apiUrl = 'https://api.github.com/';

    return {
      getUserData: getUserData,
      getUserRepos: getUserRepos
    };

    function getUserData(user) {
      return $http.get(apiUrl + 'users/' + user)
        .then(prepareUserData);
    }

    function getUserRepos(user) {
      return $http.get(apiUrl + 'users/' + user + '/repos')
        .then(prepare);

      function prepare(response) {
        var d = response.data;

        return _.map(d, function(repo) {
          return {
            name: repo.name,
            url: repo.html_url
          };
        });
      }
    }

    function prepareUserData(response) {
      var d = response.data;

      return {
        name: d.name,
        username: d.login,
        avatar: d.avatar_url,
        company: d.company || '(no company)',
        reposUrl: d.repos_url
      };
    }
  }]);

})();
(function() {

  var app = angular.module('ghLite');

  app.factory('targetUser', [function() {
    var target = null;

    return {
      get: get,
      set: set,
      isLoaded: isLoaded
    };

    function get() {
      return target;
    }

    function set(user) {
      target = user;
    }

    function isLoaded() {
      return target ? true : false;
    }
  }]);

})();