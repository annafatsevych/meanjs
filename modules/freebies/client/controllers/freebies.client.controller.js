(function () {
  'use strict';

  angular
    .module('freebies')
    .controller('FreebiesController', FreebiesController);

  FreebiesController.$inject = ['$scope', '$state', '$filter', 'freebieResolve', '$window', 'Authentication', 'CategoriesService'];

  function FreebiesController($scope, $state, $filter, freebie, $window, Authentication, CategoriesService) {
    var vm = this;
    console.log(freebie);
    console.log("This is the freebie");

    // $scope.testThis = function (test) {
    // alert('Mouse Over Event Demo');
    // console.log(test);
    // };
    vm.freebie = freebie;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;

    if (vm.freebie.categories) {
      vm.productSelection = vm.freebie.categories;
    } else {
      vm.productSelection = [];
    }
    CategoriesService.query(function (data) {
      vm.categories = data;
      console.log(vm.categories);
    });
    vm.save = save;

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.categories, {
        $: vm.search
      });
      // vm.filterLength = vm.filteredItems.length;
      // var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      // var end = begin + vm.itemsPerPage;
      // vm.pagedItems = vm.filteredItems.slice(begin, end);
      console.log(vm.filteredItems);
      console.log(vm.categories);
    }

    // Remove existing Freebie
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.freebie.$remove($state.go('freebies.list'));
      }
    }

    // Save Freebie
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.freebieForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.freebie._id) {
        vm.freebie.categories = vm.productSelection;
        vm.freebie.$update(successCallback, errorCallback);
      } else {
        console.log("In SAVEEE");

        vm.freebie.categories = vm.productSelection;
        console.log(freebie);
        vm.freebie.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('freebies.view', {
          freebieId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
