/**
 * Register controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('RegisterController', function ($scope, $modalInstance, $http, User) {

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

      $http.post('/api/auth/register', $scope.user)
        .success(function(resp) {
          $scope.errors = {};
          $modalInstance.close(true);
          angular.extend(User, resp, { authenticated: true });
        })
        .error(function (resp) {
          $scope.errors.registration = true;
          console.error(resp);
        });
    };

  });

});
