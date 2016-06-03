//Freebies service used to communicate Freebies REST endpoints
(function () {
  'use strict';

  angular
    .module('freebies')
    .factory('FreebiesService', FreebiesService);

  FreebiesService.$inject = ['$resource'];

  function FreebiesService($resource) {
    return $resource('api/freebies/:freebieId', {
      freebieId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
