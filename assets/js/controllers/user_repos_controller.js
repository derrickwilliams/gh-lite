(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    'targetUser',
    'githubApi',
    'dataStore',
    'stats',
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds, stats) {
    var
      user = targetUser.get(),
      loading = true;

    $scope.detailsUrl = detailsUrl;
    $scope.isLoading = isLoading;
    
    if (ds.exists('repos')) {
      showUserRepos(ds.get('repos'));
      showRepoStats();
      setNotLoading();
    }
    else {
      gh.getUserRepos(user.username)
        .then(showUserRepos)
        .then(showRepoStats)
        .then(setNotLoading)
        .catch(showReposError);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }

    function isLoading() {
      return loading === true;
    }

    function showUserRepos(repos) {
      $scope.repos = repos;
      ds.set('repos', repos);
    }

    function showRepoStats() {
      var 
        bar = getBarData();

      chart = c3.generate({
        bindto: document.querySelector('#languagesStats'),
        data: {
          columns: [bar.data],
          type : 'bar'
        },
        axis: {
          x: {
            type: 'category',
            categories: bar.names
          }
        }
      });
    }

    function setNotLoading() {
      loading = false;
    }

    function getBarData() {
      var 
        names = [],
        data = ['Size'];

      _.each(stats.totalLanguageStats($scope.repos), function(total, name) {
        names.push(name);
        data.push(total);
      });

      return { names: names, data: data };
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    
  }

})();