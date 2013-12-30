/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('SettingsController', function ($scope, $http, $location, User, SERVER_URL) {

    $scope.privacySetting = User.privacy_setting || 'none';

    $scope.streams = [];

    $scope.projects = ['Sleep study',  'Fitness study', 'Food study'];

    $scope.privacySettings = [
      { key: 'none', label: 'Don\'t share data' },
      { key: 'researchers_partners', label: 'Share only with researchers' },
      { key: 'researchers', label: 'Share only with approved researchers' },
      { key: 'all', label: 'Make fully public' }
    ];

    // fix bug ng-model not working
    $scope.setPrivacySetting = function (privacySetting) {
      $scope.privacySetting = privacySetting;
    };

    $scope.updatePrivacySetting = function () {
      $http.post(SERVER_URL + '/privacySetting', { privacySetting: $scope.privacySetting })
        .success(function () {
          $location.path('/account/dashboard');
        });
    };

    $http.get('/api/streams.json').success(function (response) {
      $scope.streams = response;
    });

  });

});
