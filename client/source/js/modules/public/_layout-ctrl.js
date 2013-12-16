/**
 * Home controller definition
 * @scope Controllers
 */
define(['./module', 'angular-bootstrap'], function (controllers) {
  'use strict';

  controllers.controller('LayoutController', function ($scope, $modal, $http, $location, User) {

    $scope.currentUser = User;

    $scope.login = function() {
      $modal.open({
        templateUrl: '/js/modules/public/login.html',
        controller: 'LoginController',
        windowClass: 'modal-login'
      });
    };

    $scope.register = function() {
      $modal.open({
        templateUrl: '/js/modules/public/register.html',
        controller: 'RegisterController',
        windowClass: 'modal-register'
      });
    };

    $scope.logout = function() {
      $http.get('/server/logout').success(function(data) {
        console.log(data);

        _.each(User, function(value, key) {
          delete User[key];
        });

        $location.path('/');
      });
    };

  });

});
