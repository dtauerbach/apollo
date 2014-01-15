describe('E2E: Testing App', function () {
  "use strict";

  beforeEach(function () {
    browser.get('/');
    browser.debugger();
  });

  describe('Home page', function () {
    it('should render page', function () {
      //waits(100 * 1000);
      expect(element(by.css('.main')).getText()).toContain('APOLLO');
    });
  });

});
