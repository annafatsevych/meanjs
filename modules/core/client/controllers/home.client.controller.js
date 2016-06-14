(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['FreebiesService', '$state', '$http', '$q'];

  function HomeController(FreebiesService, $state, $http, $q, freebie) {
    var vm = this;
    vm.freebies = FreebiesService.query();
    vm.saveDownloads = saveDownloads;

    function save(freebie) {
      freebie.downloads = freebie.downloads + 1;
      console.log(freebie);
      FreebiesService.update(freebie);
    }


    function saveDownloads(freebie) {
      console.log("$$$ - FREEBIE SAVE");
      console.log(freebie);
      if (freebie._id) {
        freebie.downloads = freebie.downloads + 1;
        console.log("Im in the save");
        $http.get("/api/freebies/updateDownloads/" + freebie._id)
          .then(function(response) {
            vm.myWelcome = response.data;
          });
        console.log(vm.myWelcome);
      }
    }
  }
}());
