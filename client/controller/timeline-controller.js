angular.module('plan').controller('TimelineController', ['$scope', 'history',
    function ($scope, history) {
        $scope.history = history;
    }
]);
