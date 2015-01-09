angular.module('pmsiplan').controller('StatusController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries) {

        function init () {
            $scope.deliveries = [];
            angular.forEach(deliveries, function(delivery) {
                var newDelivery = angular.copy(delivery);
                DeliveryHelper.isReady(delivery).then(function(ready) {
                    newDelivery.ready = ready;
                });
                DeliveryHelper.progress(delivery).then(function(progress) {
                    newDelivery.progress = progress * 100;
                });

                $scope.deliveries.push(newDelivery);
            });
        }

        init();

        $scope.baseDeliveries = $scope.deliveries;
    }]);

