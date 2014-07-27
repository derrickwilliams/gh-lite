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