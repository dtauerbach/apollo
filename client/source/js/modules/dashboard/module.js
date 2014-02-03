/**
 * Attach controllers to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules
 * which avails each controller of, for example, the `config` constants object.
 **/
define(['angular', 'angular-ui-router', '../../config', '../../services/index', '../../templates'], function (ng) {
  'use strict';

  return ng.module('app.dashboard', [
    'app.constants',
    'app.services',
    'ui.router',
    'templates-main'
  ])

    .config(['$stateProvider', function ($stateProvider) {

      $stateProvider

        .state('dashboard-home', {
          url: '/dashboard',
          title: 'Dashboard',
          crumb: 'Dashboard',
          requireLogin: true,
          templateUrl: '/js/modules/dashboard/home.html',
          controller : 'DashboardHomeController'
        })

        .state('dashboard-settings', {
          url: '/dashboard/settings',
          title: 'Manage Data Settings',
          crumb: 'Manage Data Settings',
          requireLogin: true,
          templateUrl: '/js/modules/dashboard/settings.html',
          controller : 'DashboardSettingsController'
        });

    }]);

});
