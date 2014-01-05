describe('E2E: Testing App', function () {
  "use strict";

  var mockUser = function() {
    var module = angular.module('app.services', []);
    module.value('User', { authenticated: true });
  };

  beforeEach(function () {
    browser.addMockModule('app.services', mockUser);
    browser.get('/dashboard');
    browser.debugger();
  });

  describe('Dashboard Home page', function () {
    it('should set test binding', function () {
      expect(element(by.css('.main')).getText()).toContain('CONNECT A DATA STREAM');
    });
  });

});
