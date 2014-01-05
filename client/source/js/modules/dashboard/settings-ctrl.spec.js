define([
  'angular-mocks',
  'Source/modules/dashboard/settings-ctrl'
], function () {

  describe('DashboardSettingsController in app.dashboard', function () {

    var scope, subject, httpBackend;

    beforeEach(function () {
      module('app.dashboard');

      module(function($provide){
        $provide.value('User', {})
      });

      inject(function ($rootScope, $controller, $httpBackend, SERVER_URL) {
        httpBackend = $httpBackend;
        httpBackend.expectGET(SERVER_URL + '/streams.json').respond(200, '');

        scope = $rootScope.$new();
        subject = $controller('DashboardSettingsController', { $scope: scope });

        httpBackend.flush();
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

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
});
