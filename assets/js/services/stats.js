// (function() {
//   var bacon = {};
// 
// })

(function() {

  var
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.factory('stats', definition);

  function fn() {

    return {
      totalLanguageStats: totalLanguageStats
    };

    function totalLanguageStats(repos) {
      var stats = {};

      _.each(repos, eachRepo);

      return stats;

      function eachRepo(repo, name) { 
        _.each(repo.languages, eachLanguage);
      }

      function eachLanguage(langSize, langName) {
        if (!stats[langName]) stats[langName] = 0;
        stats[langName] += langSize;
      }
    }

  }

})();