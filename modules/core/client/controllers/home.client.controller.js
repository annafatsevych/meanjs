(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['FreebiesService', '$state'];

  function HomeController(FreebiesService, $state, freebie) {
    var vm = this;
    vm.freebies = FreebiesService.query();
    vm.save = save;

    function save(freebie) {
      console.log(freebie);
      freebie.downloads = freebie.downloads + 1;
      FreebiesService.update(freebie);
    }


    // function save(freebie) {
    //   console.log("$$$ - FREEBIE SAVE");
    //   if (vm.freebie._id) {
    //     vm.freebie.downloads = vm.freebie.downloads + 1;
    //     vm.freebie.$update(successCallback, errorCallback);
    //   }
    //
    //   function successCallback(res) {
    //     $state.go('freebies.view', {
    //       freebieId: res._id
    //     });
    //   }
    //
    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }
  }
}());
