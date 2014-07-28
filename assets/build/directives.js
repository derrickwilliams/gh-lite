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
(function() {
  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.directive('languageBreakdown', definition);

  function fn() {
    return {
      restrict: 'AE',
      templateUrl: 'assets/views/directives/language_breakdown.html',
      link: link,
      scope: {
        languages: '='
      }
    };

    function link(scope, elem) {
      scope.hasLanguages = hasLanguages;

      showLanguagesChart();

      function hasLanguages() {
        return scope.languages.length > 0;
      }

      function showLanguagesChart () {
        var 
          data = getPieData(),
          chart;

        chart = c3.generate({
          bindto: elem[0],
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
        
        _.each(scope.languages, formatForPie);

        function formatForPie(lang) {
          cols.push([lang.name, lang.size]);
        }

        return cols;
      }
    }
  }

})();
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