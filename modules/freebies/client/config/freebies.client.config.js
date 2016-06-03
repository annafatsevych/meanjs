(function () {
  'use strict';

  angular
    .module('freebies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Freebies',
      state: 'freebies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'freebies', {
      title: 'List Freebies',
      state: 'freebies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'freebies', {
      title: 'Create Freebie',
      state: 'freebies.create',
      roles: ['user']
    });
  }
})();
