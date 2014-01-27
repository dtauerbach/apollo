describe('E2E: Testing App', function () {
  "use strict";

  beforeEach(function () {
    runs(function () {
      browser.get('/');
      browser.executeScript('$(function() { $.post("/api/auth/login", { email: "dan@example.com", password: "pass" }); })');
    });

    waits(1000);

    runs(function () {
      browser.get('/dashboard');
      browser.debugger();
    });
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
