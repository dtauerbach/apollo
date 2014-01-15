/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('DashboardServiceModalController', function ($scope) {

    $scope.scrapeState = 'start';

    // note this is only a demo for 23andme, but linked to ALL scraping forms right now
    $scope.connectStream = function() {
      $scope.scrapeState = 'pending';

      $.ajax({
        url: '/api/connect/23andme/1',
        type: 'POST',
        data: JSON.stringify({
          scrapeEmail: $scope.scrapeEmail,
          scrapePassword: $scope.scrapePassword
        }),
        contentType: 'application/json;charset=UTF-8',
      }).done(function(response) {
        $scope.scrapeState = 'done';
        $scope.scrapeResponse = response;
        $scope.$apply();
      });
    };

  });

});
