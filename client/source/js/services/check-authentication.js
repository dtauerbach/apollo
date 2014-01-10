define(['./module'], function(services) {

  services.factory('CheckAuthentication', function($rootScope, $location, $http, User, SERVER_URL) {

    var currentRoute, prevRoute;

    return {

      applicationIsBootstraped: false,

      start: function () {
        $rootScope.$on('$routeChangeStart', _.bind(function(event, current, prev) {
          currentRoute = current;
          prevRoute = prev;

          if (this.applicationIsBootstraped) {
            this.checkRoute(current, prev);
          }
        }, this));

        $http.get(SERVER_URL + '/auth/check_authentication').success(_.bind(function (resp) {
          this.applicationIsBootstraped = true;

          if (resp.username) {
            angular.extend(User, resp, { authenticated: true });
          }

          if (currentRoute) {
            this.checkRoute(currentRoute, prevRoute);
          }
        }, this));
      },

      checkRoute: function(current, prev) {
        //console.log('checkroute invoked ----', current, prev, User.authenticated);
        if (current.$$route.requireLogin && !User.authenticated) {
          //console.log('redirecting to /');
          $location.path('/');
        }

        // show/hide notifications
        if (prev && prev.$$route && prev.$$route.requireLogin && !User.authenticated) {
          //console.log(prev);
          $rootScope.notification = {
            type: 'warning',
            message: 'You must be authenticated to access this page, please login.'
          };
        } else {
          delete $rootScope.notification;
        }
      }

    };

  });

});
