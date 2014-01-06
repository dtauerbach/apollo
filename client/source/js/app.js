/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
  'angular',
  'jquery',
  'underscore',
  'angular-ui-router',
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

    // Intercept POST requests, convert to standard form encoding
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
        var key, result = [];
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
          }
        }
        return result.join("&");
      });
    }])

    .run(function($rootScope, $http, $location, User) {
      $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.title;
        $rootScope.crumb = current.crumb;
      });

      CheckAuthentication.start();
    });
});
