/**
 * Home controller definition
 * @scope Controllers
 */
define(['./module', 'angular-bootstrap'], function (controllers) {
  'use strict';

  controllers.controller('HeaderController', function ($scope, $modal) {


    $scope.login = function() {
      $modal.open({
        templateUrl: '/partials/login_modal.html',
        controller: function ($scope, $modalInstance) {
          $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
          };
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }
      });
    };

    $scope.register = function() {
      $modal.open({
        templateUrl: '/partials/register_modal.html',
        controller: function ($scope, $modalInstance) {
          $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }
      });
    };

  });

});
