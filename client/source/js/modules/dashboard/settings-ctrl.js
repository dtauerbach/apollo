/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('DashboardSettingsController', function ($scope, $http, $location, User) {

    $scope.privacy = {
      privacy: /*User.privacy_setting || */'private',
      streams: {}
    };

    $scope.streams = [];

    // kepp $scope.privacy json structure up to date with $scope.streams
    $scope.$watch('streams', function (streams) {
      $scope.privacy.streams = {};
      _.each(streams, function (stream) {
        $scope.privacy.streams[stream.key] = { projects: {} };
      });
    });

    $scope.projects = [
      { key: 'sleep_study', label: 'Sleep study' },
      { key: 'fitness_study', label: 'Fitness study' },
      { key: 'food_study', label: 'Food study' }
    ];

    $scope.privacySettings = [
      { key: 'private', label: 'Don\'t share data' },
      { key: 'researchers', label: 'Share only with researchers' },
      { key: 'approved_researchers', label: 'Share only with approved researchers' },
      { key: 'public', label: 'Make fully public' }
    ];

    $scope.updatePrivacySetting = function () {
      $http.post('/api/streams/privacy', { privacy: $scope.privacy })
        .success(function () {
          $location.path('/dashboard');
        });
    };

    $http.get('/api/streams.json').success(function (response) {
      $scope.streams = response;
    });

  });

});
