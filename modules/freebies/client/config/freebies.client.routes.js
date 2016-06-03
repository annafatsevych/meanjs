(function () {
  'use strict';

  angular
    .module('freebies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('freebies', {
        abstract: true,
        url: '/freebies',
        template: '<ui-view/>'
      })
      .state('freebies.list', {
        url: '',
        templateUrl: 'modules/freebies/client/views/list-freebies.client.view.html',
        controller: 'FreebiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Freebies List'
        }
      })
      .state('freebies.create', {
        url: '/create',
        templateUrl: 'modules/freebies/client/views/form-freebie.client.view.html',
        controller: 'FreebiesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: newFreebie
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Freebies Create'
        }
      })
      .state('freebies.edit', {
        url: '/:freebieId/edit',
        templateUrl: 'modules/freebies/client/views/form-freebie.client.view.html',
        controller: 'FreebiesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getFreebie
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Freebie {{ articleResolve.title }}'
        }
      })
      .state('freebies.view', {
        url: '/:freebieId',
        templateUrl: 'modules/freebies/client/views/view-freebie.client.view.html',
        controller: 'FreebiesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getFreebie
        },
        data: {
          pageTitle: 'Freebie {{ articleResolve.title }}'
        }
      });
  }

  getFreebie.$inject = ['$stateParams', 'FreebiesService'];

  function getFreebie($stateParams, FreebiesService) {
    return FreebiesService.get({
      freebieId: $stateParams.freebieId
    }).$promise;
  }

  newFreebie.$inject = ['FreebiesService'];

  function newFreebie(FreebiesService) {
    return new FreebiesService();
  }
}());
