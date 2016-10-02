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
          'Authorization': 'token ' + window.localData.API_TOKEN
        },
        method: 'GET'
      };

      options = _.extend(defaults, options);

      return $http(options);
    }

  }

})();