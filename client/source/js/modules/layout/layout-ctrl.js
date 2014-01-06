/**
 * Home controller definition
 * @scope Controllers
 */
define(['./module', 'angular-bootstrap'], function (controllers) {
  'use strict';

  controllers.controller('LayoutController', function ($scope, $rootScope, $modal, $http, $location, User) {

    $scope.currentUser = User;

    $rootScope.login = function() {
      $modal.open({
        templateUrl: '/js/modules/public/login.html',
        controller: 'LoginController',
        windowClass: 'modal-login'
      });
    };

    $rootScope.register = function() {
      $modal.open({
        templateUrl: '/js/modules/public/register.html',
        controller: 'RegisterController',
        windowClass: 'modal-register'
      });
    };

    $rootScope.logout = function() {
      $http.get('/api/auth/logout').success(function(data) {
        console.log(data);

        _.each(User, function(value, key) {
          delete User[key];
        });

        $location.path('/');
      });
    };

  });

});
