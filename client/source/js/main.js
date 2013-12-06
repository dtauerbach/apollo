/**
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 */
define([
  'require',
  'angular',
  './app'
], function (require, ng) {
  'use strict';

  require(['domReady!'], function (document) {
    /* everything is loaded...go! */
    ng.bootstrap(document, ['app']);
    ng.resumeBootstrap();
  });
});
