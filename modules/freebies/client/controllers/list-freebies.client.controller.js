(function () {
  'use strict';

  angular
    .module('freebies')
    .controller('FreebiesListController', FreebiesListController);

  FreebiesListController.$inject = ['FreebiesService'];

  function FreebiesListController(FreebiesService) {

    var vm = this;

    vm.testThis = function (test) {
      alert('Mouse Over Event Demo');
      console.log(test);
    };

    vm.freebies = FreebiesService.query();
  }
}());
