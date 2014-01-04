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

    function goToRoute(currentRoute) {
      rootScope.$broadcast('$routeChangeStart',
        { '$$route': currentRoute },
        { '$$route': prevRoute }
      );

      prevRoute = currentRoute;
    }

    beforeEach(inject(function ($rootScope, $location, CheckAuthentication) {
      rootScope = $rootScope;
      location = $location;
      checkAuthentication = CheckAuthentication;
    }));

    describe('start()', function () {
      beforeEach(inject(function ($httpBackend) {
        $httpBackend.when('GET', '/api/auth/check_authentication').respond('');
        checkAuthentication.applicationIsBootstraped = true;
        checkAuthentication.start();
        location.path('/randomPath');
      }));

      it('redirect to "/" if user need authentication', function () {
        expect(location.path()).not.toBe('/');
        expect(User.authenticated).toBeUndefined();
        goToRoute({ requireLogin: true });
        expect(location.path()).toBe('/');
      });

      it('add notification if previous page was protected', function () {
        expect(rootScope.notification).toBeUndefined();
        goToRoute({ requireLogin: false }, { requireLogin: true });
        expect(rootScope.notification).toBeObject();
      });

      it('remove notification next page load', function () {
        rootScope.notification = { msg: 'foo' };

        goToRoute({ requireLogin: false }, { requireLogin: false });
        expect(rootScope.notification).toBeUndefined();
      });

      it('do nothing if user is authenticated', function () {
        User.authenticated = true;
        location.path('/account/dashboard');

        expect(rootScope.notification).toBeUndefined();
        goToRoute({ requireLogin: true }, { requireLogin: false });
        expect(location.path()).toBe('/account/dashboard');
      });
    });
  });
});
