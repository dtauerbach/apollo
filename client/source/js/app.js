/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
  'angular',
  'jquery',
  'underscore',
  './config',
  './services/index',
  './modules/public/index',
  './modules/dashboard/index'
], function (ng) {
  'use strict';

  return ng
    .module('app', [
      'app.constants',
      'app.public',
      'app.dashboard',
      'app.services',
      'ui.bootstrap'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

      $routeProvider.when('/404', {
        templateUrl: '/js/partials/404.html',
        controller : function () {
          console.error('page not found');
        }
      });

      $routeProvider.otherwise({
        redirectTo: '/404'
      });

      $locationProvider.html5Mode(true);
    }]).run(function($rootScope, $http, User) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
          $rootScope.title = current.$$route.title;
          $rootScope.crumb = current.$$route.crumb;
        });

        $http.get('/server/auth/check_authentication')
          .success(function (resp) {
            if (resp) {
              angular.extend(User, resp, { authenticated: true });
            }
          });
      });
});
