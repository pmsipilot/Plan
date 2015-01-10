angular.module('pmsiplan').controller('TimelineController', ['$scope', 'history',
    function ($scope, history) {
        $scope.history = history;
    }]);
