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
        controller: 'ArticlesListController',
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
          articleResolve: newArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Freebies Create'
        }
      })
      .state('freebies.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/freebies/client/views/form-freebie.client.view.html',
        controller: 'FreebiesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Freebie {{ articleResolve.title }}'
        }
      })
      .state('freebies.view', {
        url: '/:articleId',
        templateUrl: 'modules/freebies/client/views/view-freebie.client.view.html',
        controller: 'FreebiesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          pageTitle: 'Freebie {{ articleResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'FreebiesService'];

  function getArticle($stateParams, FreebiesService) {
    return FreebiesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['FreebiesService'];

  function newArticle(FreebiesService) {
    return new FreebiesService();
  }
}());
