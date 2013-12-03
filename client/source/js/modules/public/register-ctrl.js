/**
 * Register controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('RegisterController', function ($scope, SERVER_URL) {

    $scope.user = {};

    $scope.ok = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      $.post(SERVER_URL + '/auth/register', $scope.user, console.dir);
    };

  });

});
