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