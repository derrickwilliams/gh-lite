(function() {
  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.directive('commitsList', definition);

  function fn() {
    return {
      restrict: 'AE',
      templateUrl: 'assets/views/directives/commits_list.html',
      scope: {
        commits: '=',
        limit: '='
      }
    };

  }

})();