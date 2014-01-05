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

    browser.executeScript('$(function() { $.post("/api/auth/login", { email: "dan@example.com", password: "pass" }); })');
    //console.log(browser);

    //browser.post('/api/auth/login', { email: 'dan@example.com', password: 'pass' });
  });

  describe('Dashboard Home page', function () {
    it('should render page', function () {
      expect(element(by.css('.main')).getText()).toContain('CONNECT A DATA STREAM');
    });

    it('should list data streams', function () {
      element.all(by.repeater('service in services')).then(function (arr) {
        expect(arr.length).toEqual(5);
      });
    });
  });

});
