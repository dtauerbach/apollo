/**
 * Attach controllers to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules
 * which avails each controller of, for example, the `config` constants object.
 **/
define(['angular', 'angular-ui-router', '../../config', '../../services/index'], function (ng) {
  'use strict';

  return ng.module('app.public', [
    'app.constants',
    'app.services',
    'ui.router'
  ])

    .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {

      $stateProvider

        .state('home', {
          url: '/',
          templateUrl: '/js/modules/public/home.html',
          controller : 'HomeController'
        })

        .state('about', {
          title: 'About',
          crumb: 'About',
          url: '/about',
          templateUrl: '/js/modules/public/about.html',
          controller : 'AboutController'
        })

        .state('privacy', {
          url: '/privacy',
          title: 'Privacy Policy',
          crumb: 'Privacy',
          templateUrl: '/js/modules/public/privacy.html',
          controller : 'PrivacyController'
        })

        .state('providers', {
          url: '/providers',
          title: 'Health Care Providers',
          crumb: 'Health Care Providers',
          templateUrl: '/js/modules/public/providers.html',
          controller : 'ProvidersController'
        })

        .state('researchers', {
          url: '/researchers',
          title: 'Researchers',
          crumb: 'Researchers',
          templateUrl: '/js/modules/public/researchers.html',
          controller : 'ResearchersController'
        })
      ;

    }]);

});
