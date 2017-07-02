angular.module('plan').controller('ServiceFormController', ['$scope', '$location', 'service', 'AngularDataStore',
    function($scope, $location, service, AngularDataStore) {
        $scope.service  = service;
        $scope.save = function() {
            AngularDataStore.save($scope.service);
            $location.path('/service');
        };
    }
]);
