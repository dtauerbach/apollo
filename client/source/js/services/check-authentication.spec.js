define([
  'angular-mocks',
  'Source/services/check-authentication'
], function () {
  'use strict';

  describe('CheckAuthentication Service', function () {

    var rootScope, location, checkAuthentication,
      User = {},
      $state = { go: function () {} };

    beforeEach(module('app.services'));

    beforeEach(module(function ($provide) {
      $provide.value('User', User);
      $provide.value('$state', $state);
    }));

    function goToRoute(currentRoute) {
      if (currentRoute) {
        rootScope.$broadcast('$stateChangeStart', currentRoute);
      }
    }

    beforeEach(inject(function ($rootScope, $location, $httpBackend, CheckAuthentication) {
      rootScope = $rootScope;
      location = $location;
      checkAuthentication = CheckAuthentication;

      $httpBackend.when('GET', '/api/auth/check_authentication').respond('');
      checkAuthentication.applicationIsBootstraped = true;
      checkAuthentication.initAuth();

      User.authenticated = false;

      spyOn($state, 'go');
    }));

    it('should not show warning for public page', function() {
      goToRoute({ requireLogin: false, path: '/' });

      expect(rootScope.notification).toBeUndefined();
      expect($state.go).not.toHaveBeenCalled();
    });

    it('should show warning when accessing dashboard with non authenticated user', function() {
      goToRoute({ requireLogin: true, path: '/account/dashboard' });

      expect(rootScope.notification).toBeObject();
      expect($state.go).toHaveBeenCalled();
    });

    it('should not show warning when accessing dashboard with authenticated user', function() {
      User.authenticated = true;
      goToRoute({ requireLogin: true, path: '/account/dashboard' });

      expect(rootScope.notification).toBeUndefined();
      expect($state.go).not.toHaveBeenCalled();
    });

    it('should remove warning next page', function() {
      goToRoute({ requireLogin: true, path: '/account/dashboard' });
      expect(rootScope.notification).toBeObject();

      goToRoute({ requireLogin: false, path: '/' });
      expect(rootScope.notification).toBeUndefined();
    });
  });
});
