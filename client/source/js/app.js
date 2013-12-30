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

      $routeProvider.otherwise({redirectTo: '/404'});
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

    .run(function($rootScope, $http, $location, User, SERVER_URL) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        $rootScope.crumb = current.$$route.crumb;
      });

      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route.requireLogin && !User.authenticated) {
          $rootScope.notification = {
            type: 'warning',
            message: 'You must be authenticated to access this page, please login.'
          };

          $location.path('/');
        }
      });

      $http.get(SERVER_URL + '/auth/check_authentication')
        .success(function (resp) {
          if (resp.username) {
            angular.extend(User, resp, { authenticated: true });
          }
        });
    });
});
