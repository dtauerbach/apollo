/**
 * Home controller definition
 * @scope Controllers
 */
define(['./module', 'angular-bootstrap'], function (controllers) {
  'use strict';

  controllers.controller('LayoutController', function ($scope, $modal, User) {

    $scope.currentUser = User;

    $scope.login = function() {
      $modal.open({
        templateUrl: '/js/modules/public/login.html',
        controller: 'LoginController'
      });
    };

    $scope.register = function() {
      $modal.open({
        templateUrl: '/js/modules/public/register.html',
        controller: 'RegisterController'
      });
    };

  });

});
