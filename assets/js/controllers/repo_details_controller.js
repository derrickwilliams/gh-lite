(function() {
  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    '$stateParams',
    'githubApi',
    'dataStore',
    'targetUser',
    fn
  ];

  app.controller('RepoDetailsController', definition);

  function fn($scope, $stateParams, gh, ds, user) {
    var 
      repo;

    repo = ds.get('repos')[$stateParams.repo_name];

    $scope.repo = repo;
    $scope.languages = _.map(repo.languages, function mapLanguages(size, name) {
      return {
        name: name,
        size: size
      };
    });

    showLanguagesChart  ();

    function showLanguagesChart () {
      var 
        data = getPieData(),
        chart;

      chart = c3.generate({
        bindto: document.querySelector('#languagesChart'),
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
      _.each($scope.languages, function formatForPie(lang) {
        cols.push([lang.name, lang.size]);
      });

      return cols;
    }
  }
})();