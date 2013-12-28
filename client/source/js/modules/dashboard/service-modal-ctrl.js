/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('ServiceModalController', function ($scope, SERVER_URL) {

    $scope.scrapeState = 'start';

    // note this is only a demo for 23andme, but linked to ALL scraping forms right now
    $scope.connectStream = function() {
      $.ajax({
        url: SERVER_URL + '/connect/23andme/1',
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
