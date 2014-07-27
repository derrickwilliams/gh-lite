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
    $scope.languages = _.map(repo.languages, function mapLanguages(size, name) {
      return {
        name: name,
        size: size
      };
    });

    showChart();



    function showChart() {
      var 
        data = getPieData(),
        chart;

      console.log('pie data', data);

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
    fn
  ];

  app.controller('UserReposController', definition);

  function fn($scope, targetUser, gh, ds) {
    var
      user = targetUser.get();

    $scope.detailsUrl = detailsUrl;
    
    gh.getUserRepos(user.username)
      .then(showUserRepos)
      .catch(showReposError);

    function showUserRepos(repos) {
      $scope.repos = repos;
      ds.set('repos', groupByName(repos));
    }

    function showReposError(err) {
      console.log('showReposError', err);
    }

    function detailsUrl(repoName) {
      return '#/user/' + user.username + '/repos/' + repoName;
    }

    function groupByName(repos) {
      var byName = {};

      _.each(repos, function(repo) {
        byName[repo.name] = repo;
      });

      return byName;
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
      set: set
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
          .then(function(results) {
            _.each(results, function(result, i) {
              repos[i].languages = result.data;
            });

            deferred.resolve(repos);
          })
          .catch(function(err){
            deferred.reject(err);
          });

        return deferred.promise;
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