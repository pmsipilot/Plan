angular.module('pmsiplan').controller('LoginMenuController', ['$scope', '$location', 'AuthenticateJS',
    function ($scope, $location, AuthenticateJS) {
        var reset = function () {
            $scope.loggedin = AuthenticateJS.isLoggedIn();
            $scope.user = AuthenticateJS.getUser();
        };

        $scope.$on('$routeChangeSuccess', function () {
            reset();
        });

        $scope.logout = function () {
            AuthenticateJS.logout().then(function () {
                $location.url('/login');
            });
        };

        reset();
    }
]);