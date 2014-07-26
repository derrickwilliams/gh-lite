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