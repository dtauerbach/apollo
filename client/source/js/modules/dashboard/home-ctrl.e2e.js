describe('E2E: Testing App', function () {
  "use strict";

  beforeEach(function () {
    runs(function () {
      browser.get('/');
      browser.debugger();
      element(by.css('.button-login')).click();
    });

    waits(1000);

    runs(function () {
      var loginModal = element(by.css('.modal-login'));
      loginModal.findElement(by.id('inputEmail')).sendKeys('dan@example.com');
      loginModal.findElement(by.id('inputPassword')).sendKeys('pass');
      loginModal.findElement(by.css('[type=submit]')).click();
    });

    waits(2000);

    runs(function () {
      browser.get('/dashboard');
    });
  });

  afterEach(function () {
    element(by.css('.button-logout')).click();
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
