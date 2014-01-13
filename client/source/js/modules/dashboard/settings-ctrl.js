/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  // This file contains two controller

  controllers.controller('DashboardSettingsController', function ($scope, $http, $location, User) {

    console.log(User.privacy);

    $scope.privacy = {
      privacy: User.privacy,
      streams: {}
    };

    $scope.streams = [];

    $http.get('/api/privacy').success(function (response) {
      $scope.streams = response.streams;
    });

    // keep $scope.privacy json structure up to date with $scope.streams
    $scope.$watch('streams', function (streams) {
      $scope.privacy.streams = {};
      _.each(streams, function (stream, streamId) {
        var projects = {};
        _.each(stream.projects, function (project, projectId) {
          projects[projectId] = {privacy: ''};
        });
        $scope.privacy.streams[streamId] = { projects: projects };
      });
    });

    $scope.updatePrivacySetting = function () {
      $http.post('/api/privacy', { privacy: $scope.privacy })
        .success(function () {
          $location.path('/dashboard');
        });
    };

  });

  controllers.controller('DashboardSettingsBoxController', function ($scope, $http, $location, User) {

    $scope.privacySettings = [
      { key: 'private', label: 'Don\'t share data' },
      { key: 'common_researchers', label: 'Share only with researchers' },
      { key: 'approved_researchers', label: 'Share only with approved researchers' },
      { key: 'public', label: 'Make fully public' }
    ];

    // project level
    if ($scope.stream && $scope.project) {
      $scope.boxParent = $scope.privacy.streams[$scope.streamId];
      $scope.boxModel = $scope.project;
      $scope.boxValue = $scope.privacy.streams[$scope.streamId].projects[$scope.projectId];
      $scope.boxKey = $scope.streamId + '_' + $scope.projectId + '_privacy';
    }
    
    // stream level
    else if ($scope.stream) {
      $scope.boxParent = User;
      $scope.boxModel = $scope.stream;
      $scope.boxValue = $scope.privacy.streams[$scope.streamId];
      $scope.boxKey = $scope.streamId + '_privacy';
    }
 
    // global level
    else {
      $scope.boxModel = User;
      $scope.boxValue = $scope.privacy;
      $scope.boxKey = 'global_privacy';
      console.log($scope.boxModel, $scope.boxValue);
    }

   
    $scope.toggleBox = function () {
      $scope.boxModel.isOpen = !$scope.boxModel.isOpen;
    };

    $scope.openBox = function () {
      $scope.boxModel.isOpen = true;
      $scope.boxValue.privacy = $scope.boxParent.privacy;
    };

    $scope.closeBox = function () {
      $scope.boxModel.isOpen = false;
      delete $scope.boxValue.privacy;
    };

    $scope.isBoxOpen = function () {
      return $scope.boxModel.isOpen;
    };

    // by default close all boxes
    if (!$scope.boxValue.privacy) {
      $scope.closeBox();
    }

  });



});
