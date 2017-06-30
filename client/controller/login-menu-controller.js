angular.module('pmsiplan').controller('LoginMenuController', ['$scope', '$location', 'AuthenticateJS', '$modal',
    function ($scope, $location, AuthenticateJS, $modal) {
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

        $scope.profile = function () {
            $modal.open({
                templateUrl: 'partials/profile-modal.html',
                controller: function ($scope, $modalInstance, user) {
                    $scope.user = user;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                },
                resolve: {
                    user: function () {
                        return $scope.user.data;
                    }
                }
            });
        };

        reset();
    }
]);
