(function () {
  'use strict';

  // Freebies controller
  angular
    .module('freebies')
    .controller('FreebiesController', FreebiesController);

  FreebiesController.$inject = ['$scope', '$state', 'Authentication', 'freebieResolve'];

  function FreebiesController ($scope, $state, Authentication, freebie) {
    var vm = this;

    vm.authentication = Authentication;
    vm.freebie = freebie;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Freebie
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
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
        vm.freebie.$update(successCallback, errorCallback);
      } else {
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
})();
