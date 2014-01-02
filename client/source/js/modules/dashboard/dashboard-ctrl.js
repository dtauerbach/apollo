/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module', 'underscore'], function (controllers) {
  'use strict';

  controllers.controller('DashboardController', function ($scope, $http, $modal, SERVER_URL) {

    var servicesObj = {};

    // Download services JSON, render list
    $http.get(SERVER_URL + '/streams.json').success(function(data) {
      $scope.services = _(data.services).map(function(service, serviceName) {
        service.name = serviceName;
        return service;
      });
    });

    // Services modal
    $scope.loadService = function(service) {
      $modal.open({
        templateUrl: '/js/modules/dashboard/service-modal.html',
        controller: 'ServiceModalController',
        scope: angular.extend($scope.$new(), { service: service })
      });
    };

    // Search field
    $scope.searchService = function() {
      var keywords = $scope.searchTerm.toLowerCase().split(' ');

      _.each($scope.services, function(service) {
        var keywordFound = _.any(keywords, function(keyword) {
          return service.keywords.join(' ').indexOf(keyword) !== -1;
//          return (service.keywords.join(' ').indexOf(keyword) !== -1) || (service.full_name.indexOf(keyword));
        });

        service.hide = keywords.length && !keywordFound;
      });
    };

  });

});
