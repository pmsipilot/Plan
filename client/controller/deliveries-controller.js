angular.module('plan').controller('DeliveriesController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries', 'NgTableParams',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries, NgTableParams) {

        $scope.baseDeliveries = deliveries;

        function init () {
            $scope.deliveries = [];

            angular.forEach(deliveries, function(delivery) {
                var newDelivery = angular.copy(delivery);
                DeliveryHelper.isReady(delivery).then(function(ready) {
                    newDelivery.ready = ready;
                });

                DeliveryHelper.getStartAndTargetDates(newDelivery).then(function(dates) {
                    newDelivery.start_date = dates.start_date;
                    newDelivery.target_date = dates.target_date;
                });

                $scope.deliveries.push(newDelivery);
            });
        }

        $scope.toggle = function (delivery) {
            delivery.locked = !delivery.locked;
            AngularDataStore.save(delivery);
        };

        init();

        $scope.tableParams = new NgTableParams(
            {
                page: 1,
                count: 100,
                sorting: {
                    target_date: 'desc'
                }
            },
            {
                dataset: $scope.deliveries
            }
        );

        $scope.$on('$destroy', $scope.$watch('baseDeliveries', function () {
            init();
            $scope.tableParams.reload();
        }, true));
    }
]);
