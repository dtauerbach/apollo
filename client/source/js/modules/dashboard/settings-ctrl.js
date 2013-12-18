/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('SettingsController', function ($scope, $http) {

    $scope.$watch('privacySetting', function () {
      $.post(
        '/server/privacySetting',
        { privacySetting: $scope.privacySetting }
      ).success(function () {
        console.log('ok');
      });
    });

  });

});
