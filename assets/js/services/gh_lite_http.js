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