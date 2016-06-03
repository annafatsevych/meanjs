(function () {
  'use strict';

  angular
    .module('freebies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Freebies',
      state: 'freebies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'freebies', {
      title: 'List Freebies',
      state: 'freebies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'freebies', {
      title: 'Create Freebie',
      state: 'freebies.create',
      roles: ['user']
    });
  }
}());
