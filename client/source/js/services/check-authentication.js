define(['./module'], function(services) {

  services.factory('CheckAuthentication', function($rootScope, $location, $http, User) {

    var currentRoute, prevRoute;

    function checkRoute(current, prev) {
      //console.log('checkroute invoked ----', current, prev, User.authenticated);
      if (current.requireLogin && !User.authenticated) {
        //console.log('redirecting to /');
        $location.path('/');
      }

      // show/hide notifications
      if (prev  && prev.requireLogin && !User.authenticated) {
        //console.log(prev);
        $rootScope.notification = {
          type: 'warning',
          message: 'You must be authenticated to access this page, please login.'
        };
      } else {
        delete $rootScope.notification;
      }
    }

    return {

      applicationIsBootstraped: false,

      initAuth: function () {
        $rootScope.$on('$stateChangeStart', _.bind(function(event, current, prev) {
          currentRoute = current;
          prevRoute = prev;

          if (this.applicationIsBootstraped) {
            checkRoute(current, prev);
          }
        }, this));

        $http.get('/api/auth/check_authentication').success(_.bind(function (resp) {
          this.applicationIsBootstraped = true;

          if (resp.username) {
            angular.extend(User, resp, { authenticated: true });
          }

          if (currentRoute) {
            checkRoute(currentRoute, prevRoute);
          }
        }, this));
      }

    };

  });

});
