(function (app) {
  'use strict';

  app.registerModule('freebies', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('freebies.services');
  app.registerModule('categories.services');
  app.registerModule('freebies.routes', ['ui.router', 'core.routes', 'freebies.services']);
}(ApplicationConfiguration));
