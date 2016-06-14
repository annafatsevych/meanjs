(function () {
  'use strict';

  angular
    .module('freebies.services')
    .factory('FreebiesService', FreebiesService);

  FreebiesService.$inject = ['$resource'];

  // function FreebiesService($resource) {
  //   return $resource('api/freebies/:freebieId', {
  //     freebieId: '@_id'
  //   }, {
  //     update: {
  //       method: 'PUT'
  //     }
  //   });
  // }

  function FreebiesService($resource) {
    return $resource('api/freebies/:freebieId', {
      freebieId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('categories.services')
    .factory('CategoriesService', CategoriesService);

  CategoriesService.$inject = ['$resource'];

  function CategoriesService($resource) {
    return $resource('api/categories', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
