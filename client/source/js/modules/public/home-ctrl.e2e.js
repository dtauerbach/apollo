describe('E2E: Testing App', function () {
  "use strict";

  beforeEach(function () {
    browser.get('http://apollo.dev/');
    browser.debugger();
  });

  describe('Home page', function () {
    it('should set test binding', function () {
      expect(element(by.css('.main')).getText()).toContain('APOLLO');
    });
  });

});
