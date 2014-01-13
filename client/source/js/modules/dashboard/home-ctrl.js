/**
 * Home controller definition
 * @scope Controllers
 */
define(['./module', 'underscore'], function (controllers) {
  'use strict';

  controllers.controller('DashboardHomeController', function ($scope, $http, $modal) {

    var servicesObj = {};

    // Download services JSON, render list
    $http.get('/api/streams.json').success(function(services) {
      $scope.services = services;
    });

    // Services modal
    $scope.loadService = function(service) {
      $modal.open({
        templateUrl: '/js/modules/dashboard/service-modal.html',
        controller: 'DashboardServiceModalController',
        windowClass: 'modal-service',
        scope: angular.extend($scope.$new(), { service: service })
      });
    };

    // Search field
    $scope.searchService = function() {
      var keywords = $scope.searchTerm.toLowerCase().split(' ');

      _.each($scope.services, function(service) {
        var keywordFound = _.any(keywords, function(keyword) {
          return service.keywords.join(' ').indexOf(keyword) !== -1;
        });

        service.hide = keywords.length && !keywordFound;
      });
    };

  });

});
