define([
  'angular-mocks',
  'Source/modules/layout/layout-ctrl'
], function () {
  describe('LayoutController in app.public', function () {

    var scope, subject;

    beforeEach(function () {

      module('app.layout');

      module(function($provide){
        $provide.value('$modal', {
        });
        $provide.value('User', {
        });
      });

      inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        subject = $controller('LayoutController', { $scope: scope });
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
