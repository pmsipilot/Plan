angular.module('pmsiplan').controller('DashboardController', ['$scope', 'dashboard',
    function ($scope, dashboard) {
        $scope.dashboard = dashboard;
    }]);
