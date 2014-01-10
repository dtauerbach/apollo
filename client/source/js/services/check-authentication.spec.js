define([
  'angular-mocks',
  'Source/services/check-authentication'
], function () {
  'use strict';

  describe('CheckAuthentication Service', function () {

    var prevRoute, rootScope, location, checkAuthentication, User = {};

    beforeEach(module('app.services'));

    beforeEach(module(function ($provide) {
      $provide.value('User', User);
    }));

    function goToRoute(prevRoute, currentRoute) {
      rootScope.$broadcast('$stateChangeStart', prevRoute);
      if (currentRoute) {
        rootScope.$broadcast('$stateChangeStart', currentRoute, prevRoute);
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
    }));

    it('should not show warning for /', function() {
      goToRoute({ requireLogin: false, path: '/' });
      expect(rootScope.notification).toBeUndefined();
    });

    it('should show warning when accessing dashboard', function() {
      // when accessing the dashboard (i'm not logged in) then I get redirected to /
      // so we are actually testing the end result of our navigation
      goToRoute({ requireLogin: true, path: '/account/dashboard' }, { requireLogin: false, path: '/' });
      expect(rootScope.notification).toBeObject();
    });

    it('after login should hide the warning', function() {
      User.authenticated = true;
      goToRoute({ requireLogin: true, path: '/account/dashboard' }, { requireLogin: false, path: '/' });
      expect(rootScope.notification).toBeUndefined();
    });

//    it('while on private page, I logout and I get redirected to / without seeing the warning', function() {
//      User.authenticated = true;
//      goToRoute({ requireLogin: false, path: '/' }, { requireLogin: true, path: '/account/settings' });
//      User.authenticated = false;
//      goToRoute({ requireLogin: true, path: '/account/settings' }, { requireLogin: false, path: '/' });
//      expect(rootScope.notification).toBeUndefined();
//    });

  });
});
