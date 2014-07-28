(function() {
  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.directive('usernameInputForm', definition);

  function fn() {
    return {
      restrict: 'AE',
      templateUrl: 'assets/views/directives/username_input_form.html',
      link: link,
      scope: {
        username: '=',
        submit: '='
      }
    };

    function link(scope, elem, attrs) {
      scope.submitDisabled = submitDisabled;

      function submitDisabled() {
        return scope.username.length === 0;
      }
    }
  }

})();