define(['./module'], function(services) {

  services.factory('CheckAuthentication', function($rootScope, $state, $http, User) {

    var currentRoute;

    function checkRoute(current) {
      if (current.requireLogin && !User.authenticated) {
        $state.go('home');

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
        $rootScope.$on('$stateChangeStart', _.bind(function(event, current) {
          currentRoute = current;

          if (this.applicationIsBootstraped) {
            checkRoute(current);
          }
        }, this));

        $http.get('/api/auth/check_authentication').success(_.bind(function (resp) {
          this.applicationIsBootstraped = true;

          $http.defaults.headers.common['X-CSRFToken'] = resp.csrf_token;

          if (resp.username) {
            angular.extend(User, resp, { authenticated: true });
          }

          if (currentRoute) {
            checkRoute(currentRoute);
          }
        }, this));
      }

    };

  });

});
