/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('SettingsController', function ($scope, $http, $location, User) {

    $scope.privacySetting = User.privacy_setting || 'none';

    $scope.privacySettings = [
      {
        key: 'none',
        label: 'Do not share data',
        description: (
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        )
      },
      {
        key: 'researchers_partners',
        label: 'Share with researchers partners',
        description: (
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        )
      },
      {
        key: 'researchers',
        label: 'Share with researchers',
        description: (
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        )
      },
      {
        key: 'all',
        label: 'Make fully public',
        description: (
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        )
      }
    ];

    // fix bug ng-model not working
    $scope.setPrivacySetting = function (privacySetting) {
      $scope.privacySetting = privacySetting;
    };

    $scope.updatePrivacySetting = function () {
      $http.post('/server/privacySetting', { privacySetting: $scope.privacySetting })
        .success(function () {
          $location.path('/account/dashboard');
        });
    };

  });

});
