/**
 * defines constants for application
 */
define(['angular'], function (ng) {
  'use strict';
  return ng.module('app.constants', [])
    .constant('CONFIG', {})
    .constant('SERVER_URL', '/server')
  ;
});
