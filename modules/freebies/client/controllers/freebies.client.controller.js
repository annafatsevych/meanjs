(function () {
  'use strict';

  angular
    .module('freebies')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'articleResolve', '$window', 'Authentication'];

  function ArticlesController($scope, $state, freebie, $window, Authentication) {
    var vm = this;

    vm.freebie = freebie;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Freebie
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.freebie.$remove($state.go('freebies.list'));
      }
    }

    // Save Freebie
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
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
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
