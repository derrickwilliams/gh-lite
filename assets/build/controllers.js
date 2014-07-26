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