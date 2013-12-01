/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
  'angular',
  './config',
  './modules/public/index',
  './modules/dashboard/index'
], function (ng) {
  'use strict';

  return ng.module('app', [
    'app.constants',
    'app.public',
    'app.dashboard',
    'ui.bootstrap'
  ]);
});
