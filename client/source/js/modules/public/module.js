/**
 * Attach controllers to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules
 * which avails each controller of, for example, the `config` constants object.
 **/
define(['angular', '../../config', '../../services/index'], function (ng) {
  'use strict';

  return ng.module('app.public', ['app.constants', 'app.services'])

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

      $routeProvider.when('/', {
        templateUrl: '/js/modules/public/home.html',
        controller : 'HomeController'
      });

      $routeProvider.when('/about', {
        title: 'About',
        crumb: 'About',
        templateUrl: '/js/modules/public/about.html',
        controller : 'AboutController'
      });

      $routeProvider.when('/privacy', {
        title: 'Privacy Policy',
        crumb: 'Privacy',
        templateUrl: '/js/modules/public/privacy.html',
        controller : 'PrivacyController'
      });

      $routeProvider.when('/providers', {
        title: 'Health Care Providers',
        crumb: 'Health Care Providers',
        templateUrl: '/js/modules/public/providers.html',
        controller : 'ProvidersController'
      });

      $routeProvider.when('/researchers', {
        title: 'Researchers',
        crumb: 'Researchers',
        templateUrl: '/js/modules/public/researchers.html',
        controller : 'ResearchersController'
      });

    }]);

});
