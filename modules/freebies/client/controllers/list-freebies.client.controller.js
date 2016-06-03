(function () {
  'use strict';

  angular
    .module('freebies')
    .controller('FreebiesListController', FreebiesListController);

  FreebiesListController.$inject = ['FreebiesService'];

  function FreebiesListController(FreebiesService) {
    var vm = this;

    vm.freebies = FreebiesService.query();
  }
})();
