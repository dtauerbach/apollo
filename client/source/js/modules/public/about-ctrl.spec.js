define([
  'angular-mocks',
  'Source/modules/public/about-ctrl'
], function () {
  describe('AboutController in app.public', function () {

    var scope, subject;

    beforeEach(function () {

      module('app.public');

      inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        subject = $controller('AboutController', { $scope: scope });
      });
    });

    describe('check if controller is on it\'s place', function () {
      it('should have loaded the subject', function () {
        expect(subject).toBeDefined();
      });
    });

    describe('check if scope is also on it\'s place', function () {
      it('should test scope to be defined', function () {
        expect(scope).toBeDefined();
      });
    });

  });
});
