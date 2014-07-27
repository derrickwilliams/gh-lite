(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$q',
    '$http',
    fn
  ];

  app.factory('githubApi', definition);

  function fn($q, $http) {
    var
      apiUrl = 'https://api.github.com/';

    return {
      getUserData: getUserData,
      getUserRepos: getUserRepos,
      getRepoData: getRepoData
    };

    function getUserData(user) {
      return $http.get(apiUrl + 'users/' + user)
        .then(prepareUserData);
    }

    function getUserRepos(user) {
      return $http.get(apiUrl + 'users/' + user + '/repos')
        .then(prepare)
        .then(getLanguages)
        .then(indexByName);

      function prepare(response) {
        var 
          d = response.data,
          prepared;

        prepared =  _.map(d, function(repo) {
          return {
            name: repo.name,
            url: repo.html_url,
            languages: repo.languages_url
          };
        });

        return prepared;
      }

      function getLanguages(repos) {
        var 
          deferred = $q.defer();

        $q.all(getLanguagePromises(repos))
          .then(setAllLanguages)
          .catch(allLanguagesError);

        return deferred.promise;

        function setAllLanguages(results) {
          _.each(results, function setLanguages(result, i) {
            repos[i].languages = result.data;
          });

          deferred.resolve(repos);
        }

        function allLanguagesError(err){
          deferred.reject(err);
        }
      }

      function indexByName(repos) {
        var indexed = {};

        _.each(repos, function byName(repo) {
          indexed[repo.name] = repo;
        });

        return indexed;
      }

      function getLanguagePromises(repos) {
        return _.map(repos, function(repo) {
          return $http.get(repo.languages);
        });
      }
    }

    function getRepoData(user, repo) {
      return $http.get(apiUrl + '/repos/' + user + '/' + repo + '/stats')
        .then(function(data) {
          console.log('got repo data', data);
        });
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
  }

})();