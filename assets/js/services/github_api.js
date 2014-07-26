(function() {

  var app = angular.module('ghLite');

  app.factory('githubApi', ['$http', function($http) {
    var
      apiUrl = 'https://api.github.com/';

    return {
      getUserData: getUserData,
      getUserRepos: getUserRepos
    };

    function getUserData(user) {
      return $http.get(apiUrl + 'users/' + user)
        .then(prepareUserData);
    }

    function getUserRepos(user) {
      return $http.get(apiUrl + 'users/' + user + '/repos')
        .then(prepare);

      function prepare(response) {
        var d = response.data;

        return _.map(d, function(repo) {
          return {
            name: repo.name,
            url: repo.html_url
          };
        });
      }
    }

    function prepareUserData(response) {
      var d = response.data;

      return {
        name: d.name,
        username: d.login,
        avatar: d.avatar_url,
        company: d.company || '(no company)',
        reposUrl: d.repos_url
      };
    }
  }]);

})();