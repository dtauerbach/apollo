define([
  'angular-mocks',
  'Source/modules/dashboard/dashboard-ctrl'
], function () {

  describe('DashboardController in app.dashboard', function () {

    var scope, subject, httpBackend;


    beforeEach(function () {
      module('app.dashboard');

      module(function($provide){
        $provide.value('$modal', {
        })
      });

      inject(function ($rootScope, $controller, $httpBackend) {
        httpBackend = $httpBackend;
        httpBackend.expectGET('/server/services.json').respond(200, '');

        scope = $rootScope.$new();
        subject = $controller('DashboardController', { $scope: scope });

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

    describe('check search', function () {
      it('should return matching servive 1', function () {
        var s1 = {
          "full_name": "23andme",
          "url": "http://23andme.com",
          "icon": "23andMe_Logo_blog.jpg",
          "keywords": ["genes", "genetics", "biology", "disease", "23andme"],
          "connect_type": "scraping"
        };
        var s2 = {
          "full_name": "Jawbone UP",
          "url": "http://jawbone.com",
          "icon": "jawbone_up.jpg",
          "keywords": ["jawbone", "exercise", "wellness", "quantified self", "jawbone up"],
          "connect_type": "oauth"
        };
        scope.services = {
          '23andme': s1,
          'jawbone up': s2
        };
        scope.searchTerm = '23';

        scope.searchService();

        expect(s1.hide).toBe(false);
        expect(s2.hide).toBe(true);
      });
    });

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

  });
});
