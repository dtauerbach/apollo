/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
  'angular',
  'jquery',
  'underscore',
  'angular-ui-router',
  'angular-bootstrap',
  './config',
  './services/index',
  './modules/public/index',
  './modules/layout/index',
  './modules/dashboard/index'
], function (ng) {
  'use strict';

  return ng
    .module('app', [
      'app.constants',
      'app.public',
      'app.dashboard',
      'app.layout',
      'app.services',
      'ui.bootstrap',
      'ui.router'
    ])

    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $locationProvider) {
      $stateProvider.state('404', {
        url: '/404',
        templateUrl: '/js/partials/404.html',
        controller : function () {
          console.error('page not found');
        }
      });

      $urlRouterProvider.otherwise('/404');
      $locationProvider.html5Mode(true);
    }])

    .run(['$rootScope', function($rootScope) {
      $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.title;
        $rootScope.crumb = current.crumb;
      });
    }]);
});
