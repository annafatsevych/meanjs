(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['FreebiesService', 'CategoriesService', '$state', '$http', '$q', '$filter'];

  function HomeController(FreebiesService, CategoriesService, $state, $http, $q, freebie, $filter) {
    var vm = this;
    vm.freebies = FreebiesService.query();
    console.log("THIS IS FREE");
    console.log(vm.freebies);
    vm.saveDownloads = saveDownloads;
    vm.filters = {};
    vm.filters.categories = [];
    vm.filterFn = filterFn;
    vm.cuButtonPressed = false;
    vm.puButtonPressed = false;


    function filterFn(cats) {
      console.log(cats);
     // Do some tests
      var log = [];

      _.forEach(vm.freebies, function(freebie, key) {
        _.forEach(freebie.categories, function(category, key) {
          _.forEach(cats, function(cat, key) {
            if (cat.name === category.name) {
              console.log(category.name);
              log.push(freebie);
            }
          });
        });
        // console.log(value);
      });
      _.forEach(cats, function(value, key) {

      });
      // angular.forEach(vm.freebies.categories, function(value, key) {
      //   angular.forEach(cats, function(value, key){
      //     console.log(value);
      //   });
      //   this.push(key + ': ' + value);
      // }, log);
      console.log(log);
      return log;
    }

    console.log(vm.filters);

    CategoriesService.query(function (data) {
      vm.categories = data;
      console.log(vm.categories);
    });

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
