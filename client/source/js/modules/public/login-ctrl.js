/**
 * Login controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('LoginController', function ($scope, SERVER_URL) {

    $scope.ok = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      $.post(SERVER_URL + '/auth/register', {
        email: $scope.email,
        password: $scope.password
      }, console.dir);
    };

  });

});
