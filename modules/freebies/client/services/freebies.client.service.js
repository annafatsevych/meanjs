(function () {
  'use strict';

  angular
    .module('freebies.services')
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
}());
