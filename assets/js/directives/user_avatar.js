(function() {
  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.directive('userAvatar', definition);

  function fn() {
    return {
      restrict: 'AE',
      templateUrl: 'assets/views/directives/user_avatar.html',
      scope: {
        avatarSrc: '='
      }
    };
  }

})();