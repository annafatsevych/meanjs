(function () {
  'use strict';

  angular
    .module('freebies')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['FreebiesService'];

  function ArticlesListController(FreebiesService) {
    var vm = this;

    vm.freebies = FreebiesService.query();
  }
}());
