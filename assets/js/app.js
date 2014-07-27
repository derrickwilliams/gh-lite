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