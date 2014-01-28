/**
 * Researchers controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('ResearchersController', function ($scope, $http) {

    $scope.submit = function () {
      $http.post('/api/contact/researchers', $scope.contact)
        .success(function (resp) {
          console.log(resp);
        });
    };

  });

});
