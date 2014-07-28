(function() {
  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.directive('userDetailsSection', definition);

  function fn() {
    return {
      restrict: 'AE',
      templateUrl: 'assets/views/directives/user_details_section.html',
      scope: {
        user: '=',
        username: '='
      }
    };
  }

})();