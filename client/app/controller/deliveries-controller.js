angular.module('pmsiplan').controller('DeliveriesController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries', 'NgTableParams',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries, NgTableParams) {

        $scope.baseDeliveries = deliveries;

        function init () {
            $scope.deliveries = [];
            angular.forEach(deliveries, function(delivery) {
                var newDelivery = angular.copy(delivery);
                DeliveryHelper.isReady(delivery).then(function(ready) {
                    newDelivery.ready = ready;
                });
                $scope.deliveries.push(newDelivery);
            });
        }

        $scope.removeDelivery = function (delivery) {
            if (confirm('Are you sure you want to delete this delivery ?')) {
                AngularDataStore.remove(delivery);
            }
        };

        $scope.lock = function (delivery) {
            delivery.locked = true;
            AngularDataStore.save(delivery);
        };

        $scope.unlock = function (delivery) {
            delivery.locked = false;
            AngularDataStore.save(delivery);
        };

        init();

        $scope.tableParams = new NgTableParams({
            page: 1,            // show first page
            count: 100,          // count per page
            sorting: {
                version: 'desc'     // initial sorting
            }
        }, {
            dataset: $scope.deliveries
        });

        $scope.$watch('baseDeliveries', function () {
            init();
            $scope.tableParams.reload();
        }, true);

    }]);
