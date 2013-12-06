/**
 * Login controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('LoginController', function ($scope, $modalInstance, User, SERVER_URL) {

    $scope.user = {
      email: '',
      password: ''
    };

    $scope.ok = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      $.post(SERVER_URL + '/auth/login', $scope.user, function(resp) {
        if (resp.success) {
          $scope.error = false;
          $modalInstance.close(true);
          angular.extend(User, $scope.user, { authenticated: true });
        } else {
          $scope.error = true;
        }

        $scope.$apply();
      });
    };

  });

});
