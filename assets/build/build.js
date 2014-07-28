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

  var 
    app = angular.module('ghLite'),
    definition;

  definition = [
    '$scope',
    '$state',
    'dataStore',
    fn 
  ];

  app.controller('HomeController', definition);

  function fn($scope, $state, ds) {
    $scope.username = '';
    $scope.onSubmit = onSubmit;

    function onSubmit(e) {
      ds.set('repos', undefined);
      $state.go('user_details', { username: $scope.username });
    }
  }

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
    '$state',
    fn
  ];

  app.controller('RepoDetailsController', definition);

  function fn($scope, $stateParams, gh, ds, user, $state) {
    var 
      repo;

    if (!ds.exists('repos')) {
      $state.go('home');
      return;
    }

    repo = ds.get('repos')[$stateParams.repo_name];

    $scope.repo = repo;
    $scope.languages = _.map(repo.languages, mapLanguages);
    $scope.commits = _.map(repo.commits, mapCommits);

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
    '$state',
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds, stats, $state) {
    var
      user = targetUser.get(),
      loading = true;

    if (!user) {
      $state.go('home');
      return;
    }

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
    '$http',
    fn
  ];

  app.factory('ghLiteHttp', definition);

  function fn($http) {

    return http;

    function http(options) {
      var defaults;

      defaults = {
        headers: {
          'Authorization': 'token 19ac7ba3181784b26378176b3c2c498664399084'
        },
        method: 'GET'
      };

      options = _.extend(defaults, options);

      return $http(options);
    }

  }

})();
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