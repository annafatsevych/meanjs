(function (app) {
  'use strict';

  app.registerModule('core', ['freebies', 'ui.select', 'ngAnimate', 'ngSanitize']);
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
}(ApplicationConfiguration));
