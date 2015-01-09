angular.module('pmsiplan').controller('StatusController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries) {

        function init () {
            $scope.deliveries = [];
            angular.forEach(deliveries, function(delivery) {
                $scope.deliveries.push(delivery);
            });
        }

        init();

        $scope.baseDeliveries = $scope.deliveries;
    }]);

