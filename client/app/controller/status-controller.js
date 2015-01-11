angular.module('pmsiplan').controller('StatusController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries) {

        function init () {
            $scope.deliveries = [];

            angular.forEach(deliveries, function(delivery) {
                delivery.progress = delivery.progress || 0;
                delivery.progressPlanned = delivery.progressPlanned || 0;
                delivery.progressCurrent = delivery.progressCurrent || 0;
                delivery.progressBlocked = delivery.progressBlocked || 0;

                $scope.deliveries.push(delivery);
            });
        }

        init();

        $scope.baseDeliveries = $scope.deliveries;
    }]);

