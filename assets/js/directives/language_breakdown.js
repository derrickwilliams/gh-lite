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