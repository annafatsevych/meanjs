(function () {
  'use strict';

  angular
    .module('freebies.services')
    .factory('FreebiesService', FreebiesService);

  FreebiesService.$inject = ['$resource'];

  function FreebiesService($resource) {
    return $resource('api/freebies/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
