/**
 * Login controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('LoginController', function ($scope, $modalInstance, $http, User) {

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
      $http.post('/api/auth/login', $scope.user)
        .success(function (resp) {
          $scope.error = false;
          $modalInstance.close(true);
          angular.extend(User, resp, { authenticated: true });
        })
        .error(function () {
          $scope.error = true;
        });
    };

  });

});
