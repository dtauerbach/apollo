define([
  'angular-mocks',
  'Source/services/check-authentication'
], function () {
  'use strict';

  describe('CheckAuthentication Service', function () {

    var rootScope, location, checkAuthentication;

    beforeEach(module('app.services'));

    beforeEach(module(function ($provide) {
      $provide.value('User', {});
    }));

    beforeEach(inject(function ($rootScope, $location, CheckAuthentication) {
      rootScope = $rootScope;
      location = $location;
      checkAuthentication = CheckAuthentication;
    }));

    describe('start()', function () {
      beforeEach(inject(function ($httpBackend) {
        $httpBackend.when('GET', '/api/auth/check_authentication').respond('');
        checkAuthentication.start();
      }));

      it('redirect to "/" if user need authenticatin', function () {
        expect(rootScope.notification).toBeUndefined();

        rootScope.$broadcast('$routeChangeStart',
          { '$$route': { requireLogin: true } }
        );

        expect(location.path()).toBe('/');

        rootScope.$broadcast('$routeChangeStart',
          { '$$route': { requireLogin: false } },
          { '$$route': { requireLogin: true} }
        );

        expect(rootScope.notification).toBeObject();

        rootScope.$broadcast('$routeChangeStart',
          { '$$route': { requireLogin: false } },
          { '$$route': { requireLogin: false } }
        );

        expect(rootScope.notification).toBeUndefined();
      });
    });

  });
});
