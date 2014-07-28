(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$q',
    'ghLiteHttp',
    fn
  ];

  app.factory('githubApi', definition);

  function fn($q, http) {
    var
      apiUrl = 'https://api.github.com/';

    return {
      getUserData: getUserData,
      getUserRepos: getUserRepos,
      getRepoData: getRepoData
    };

    function getUserData(user) {
      var getOptions;

      getOptions = {
        url: apiUrl + 'users/' + user,
      };

      return http(getOptions)
        .then(prepareUserData);
    }

    function getUserRepos(user) {
      var getOptions;

      getOptions = {
        url: apiUrl + 'users/' + user + '/repos'
      };

      return http(getOptions)
        .then(prepare)
        .then(getLanguages)
        .then(getCommits)
        .then(indexByName);

      function prepare(response) {
        var 
          d = response.data,
          prepared;

        prepared =  _.map(d, function(repo) {
          return {
            name: repo.name,
            url: repo.html_url,
            languages: repo.languages_url,
            commits: repo.commits_url
          };
        });

        return prepared;
      }

      function getLanguages(repos) {
        var 
          deferred = $q.defer();

        $q.all(getPromises(repos, 'languages'))
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

      function getCommits(repos) {
        var 
          deferred = $q.defer();

        repos = _.map(repos, function(r) {
          r.commits = r.commits.replace('{/sha}', '');
          return r;
        });

        $q.all(getPromises(repos, 'commits'))
          .then(removeNulls)
          .then(setCommits)
          .catch(commitsError);

        return deferred.promise;

        function removeNulls(repos) {
          return _.filter(repos, function filterNulls(r) {
            return r !== null;
          });
        }

        function setCommits(results) {
          _.each(results, function setLanguages(result, i) {
            repos[i].commits = result.data;
          });

          deferred.resolve(repos);
        }

        function commitsError(err){
          deferred.reject(err);
        }
      }

      function indexByName(repos) {
        var indexed = {};

        _.each(repos, byName);

        return indexed;

        function byName(repo) {
          indexed[repo.name] = repo;
        }
      }

      function getPromises(repos, prop) {
        return _.map(repos, toPromises);

        function toPromises(repo) {          
          return http({ url: repo[prop] })
            .catch(handleErrorsWithNull);
        }

        function handleErrorsWithNull(err) {
          return null;
        }
      }
    }

    function getRepoData(user, repo) {
      var url = apiUrl + '/repos/' + user + '/' + repo + '/stats';
      
      return http.get({ url: url })
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

    function getRequestOptions(url) {

    }
  }

})();