define(['./module'], function(services) {

  services.factory('CheckAuthentication', function($rootScope, $location, $http, User, SERVER_URL) {

    return {
      start: function () {
        $rootScope.$on('$routeChangeStart', function(event, current, prev) {
          // if current route requires Login, redirection
          if (current.$$route.requireLogin && !User.authenticated) {
            $location.path('/');
          }

          // show/hide notifications
          if (prev && prev.$$route.requireLogin) {
            $rootScope.notification = {
              type: 'warning',
              message: 'You must be authenticated to access this page, please login.'
            };
          } else {
            delete $rootScope.notification;
          }
        });

        $http.get(SERVER_URL + '/auth/check_authentication').success(function (resp) {
          if (resp.username) {
            angular.extend(User, resp, { authenticated: true });
          }
        });
      }
    };

  });

});
