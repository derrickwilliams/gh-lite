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
    $scope.submitDisabled = submitDisabled;

    function onSubmit(e) {
      ds.set('repos', undefined);
      $state.go('user_details', { username: $scope.username });
    }

    function submitDisabled() {
      return $scope.username.length === 0;
    }
  }

})();