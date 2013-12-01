define([
  'angular-mocks',
  'Source/modules/dashboard/dashboard-ctrl'
], function () {

  describe('DashboardController in app.dashboard', function () {

    var scope, subject;

    beforeEach(function () {

      module('app.dashboard');

      inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        subject = $controller('DashboardController', { $scope: scope });
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
