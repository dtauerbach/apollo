/**
 * Dashboard controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';

  // This file contains two controller

  controllers.controller('DashboardSettingsController', function ($scope, $http, $location, User) {

    $scope.privacy = {
      privacy: /*User.privacy_setting || */'private',
      streams: {}
    };

    $scope.streams = [];

    $scope.projects = [
      { key: 'sleep_study', label: 'Sleep study' },
      { key: 'fitness_study', label: 'Fitness study' },
      { key: 'food_study', label: 'Food study' }
    ];

    $http.get('/api/streams.json').success(function (response) {
      $scope.streams = response;

      // waiting api to return 'projects' too, for now we add them manually
      _.each($scope.streams, function(stream) {
        stream.projects = _.clone($scope.projects);
      });
    });

    // keep $scope.privacy json structure up to date with $scope.streams
    $scope.$watch('streams', function (streams) {
      $scope.privacy.streams = {};
      _.each(streams, function (stream) {
        var projects = {};
        _.each($scope.projects, function (project) {
          projects[project.key] = {};
        });
        $scope.privacy.streams[stream.key] = { projects: projects };
      });
    });

    $scope.updatePrivacySetting = function () {
      $http.post('/api/streams/privacy', { privacy: $scope.privacy })
        .success(function () {
          $location.path('/dashboard');
        });
    };

  });

  controllers.controller('DashboardSettingsBoxController', function ($scope, $http, $location, User) {

    $scope.privacySettings = [
      { key: 'private', label: 'Don\'t share data' },
      { key: 'researchers', label: 'Share only with researchers' },
      { key: 'approved_researchers', label: 'Share only with approved researchers' },
      { key: 'public', label: 'Make fully public' }
    ];

    // project level
    if ($scope.stream && $scope.project) {
      $scope.boxParent = $scope.stream;
      $scope.boxModel = $scope.project;
      $scope.boxValue = $scope.privacy.streams[$scope.stream.key].projects[$scope.project.key];
      $scope.boxKey = $scope.stream.key + '_' + $scope.project.key + '_privacy';
    }
    
    // stream level
    else if ($scope.stream) {
      $scope.boxParent = User;
      $scope.boxModel = $scope.stream;
      $scope.boxValue = $scope.privacy.streams[$scope.stream.key];
      $scope.boxKey = $scope.stream.key + '_privacy';
    }
 
    // global level
    else {
      $scope.boxModel = User;
      $scope.boxValue = $scope.privacy;
      $scope.boxKey = 'privacy';
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
    $scope.closeBox();

  });



});
