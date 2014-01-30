/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('DashboardServiceModalController', function ($scope, $http) {

    $scope.scrapeState = 'start';

    // note this is only a demo for 23andme, but linked to ALL scraping forms right now
    $scope.connectStream = function() {
      $scope.scrapeState = 'pending';

      $http.post('/api/connect/23andme/1', {
        scrapeEmail: $scope.scrapeEmail,
        scrapePassword: $scope.scrapePassword
      })
        .success(function(response) {
          $scope.scrapeState = 'done';
          $scope.scrapeResponse = response;
        });
    };

  });

});
