/**
 * Register controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('RegisterController', function ($scope, $modalInstance, User) {

    $scope.user = {
      /*
      username: 'foo',
      email: 'foo@foo.com',
      password: 'pass'
      */
    };

    $scope.errors = {};

    $scope.ok = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      if (!$scope.user.terms) {
        return $scope.errors.terms = true;
      }

      $scope.errors.terms = false;

      $.post('/api/auth/register', $scope.user, function(resp) {
        if (resp.success) {
          $scope.errors = {};
          $modalInstance.close(true);
          angular.extend(User, $scope.user, { authenticated: true });
        } else {
          $scope.errors.registration = true;
          console.error(resp);
        }

        $scope.$apply();
      });
    };

  });

});
