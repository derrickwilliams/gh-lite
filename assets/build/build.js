(function() {

  var app = angular.module('ghLite', ['ui.router']);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      
      .state({
        name: 'home',
        url: '/',
        templateUrl: 'assets/views/home.html',
        controller: 'HomeController'
      })

      .state({
        name: 'user_details',
        url: '/user/:username',
        templateUrl: 'assets/views/user_details.html',
        controller: 'UserDetailsController'
      })

      .state({
        name: 'user_repos',
        url: '/user/:username/repos',
        templateUrl: 'assets/views/user_repos.html',
        controller: 'UserReposController'
      })

      .state({
        name: 'repo_details',
        url: '/user/:username/repos/:repo_name',
        templateUrl: 'assets/views/repo_details.html',
        controller: 'RepoDetailsController'
      })

      .state({
        name: 'user_orgs',
        url: '/user/:username/orgs',
        templateUrl: 'assets/views/user_orgs.html',
        controller: 'UserOrgsController'
      });

  }]);

})();
(function() {

  var app = angular.module('ghLite');

  app.controller('HomeController', ['$scope', '$state', function($scope, $state) {
    $scope.userName = '';
    $scope.onSubmit = onSubmit;

    debugger

    function onSubmit(e) {
      $state.go('user_details', { username: $scope.userName });
    }
  }]);

})();
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
    $scope.languages = _.map(repo.languages, mapLanguages);
    $scope.commits = _.map(repo.commits, mapCommits);

    $scope.hasLanguages = hasLanguages;

    _.defer(showLanguagesChart);

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

    function hasLanguages() {
      return $scope.languages.length > 0;
    }

    function mapLanguages(size, name) {
      return {
        name: name,
        size: size
      };
    }

    function mapCommits(commit) {
      return commit.commit;
    }
  }
})();
(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    'githubApi',
    '$stateParams',
    'targetUser',
    'dataStore',
    fn
  ];

  app.controller('UserDetailsController', definition);

  function fn($scope, gh, $stateParams, targetUser, ds) {
    $scope.username = $stateParams.username;

    gh.getUserData($scope.username)
      .then(displayUserData)
      .catch(displayError);

    function displayUserData(userData) {
      $scope.userData = userData;
      targetUser.set($scope.userData);
    }

    function displayError(err) {
      console.log('ERROR', err);
    }
  }

})();
(function() {

  var app = angular.module('ghLite');

  app.controller('UserOrgsController', ['$scope', function($scope) {
    console.log('user orgs');
  }]);

})();
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
(function() {

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    fn
  ];

  app.factory('c3DataFormatter', definition);

  function fn() {
    return {

    };
  }

})();
(function() {

  var app = angular.module('ghLite');

  app.factory('dataStore', [function() {
    var
      store = {};

    return {
      get: get,
      set: set,
      exists: keyExists
    };

    function get(key) {
      return store[key];
    }

    function set(key, value) {
      store[key] = value;
    }

    function keyExists(key) {
      return store[key] !== undefined;
    }
  }]);

})();
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
      var getOptions;

      getOptions = {
        url: apiUrl + 'users/' + user,
        headers: {
          'Authorization': 'token 19ac7ba3181784b26378176b3c2c498664399084'
        },
        method: 'GET'
      };

      return $http(getOptions)
        .then(prepareUserData);
    }

    function getUserRepos(user) {
      var getOptions;

      getOptions = {
        url: apiUrl + 'users/' + user + '/repos',
        headers: {
          'Authorization': 'token 19ac7ba3181784b26378176b3c2c498664399084'
        },
        method: 'GET'
      };

      return $http(getOptions)
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
        var getOptions;

        getOptions = {
          headers: {
            'Authorization': 'token 19ac7ba3181784b26378176b3c2c498664399084'
          },
          method: 'GET'
        };

        return _.map(repos, mapToPromises);

        function mapToPromises(repo) {
          getOptions.url = repo[prop];
          
          return $http(getOptions)
            .catch(handleErrorsWithNull);
        }

        function handleErrorsWithNull(err) {
          return Promise.resolve(null);
        }
      }
    }

    function getRepoData(user, repo) {
      var getOptions;

      getOptions = {
        url: apiUrl + '/repos/' + user + '/' + repo + '/stats',
        headers: {
          'Authorization': 'token 5199831f4dd3b79e7c5b7e0ebe75d67aa66e79d4'
        }
      };

      return $http.get(getOptions)
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
(function() {

  var app = angular.module('ghLite');

  app.factory('targetUser', [function() {
    var target = null;

    return {
      get: get,
      set: set,
      isLoaded: isLoaded
    };

    function get() {
      return target;
    }

    function set(user) {
      target = user;
    }

    function isLoaded() {
      return target ? true : false;
    }
  }]);

})();