angular.module('pmsiplan').controller('DeliveriesController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries', 'ngTableParams',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries, ngTableParams) {

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

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 100,          // count per page
            sorting: {
                version: 'desc'     // initial sorting
            }
        }, {
            total: $scope.deliveries.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ? $filter('filter')($scope.deliveries, params.filter()) : $scope.deliveries;
                orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {} },
            debugMode: false
        });

        $scope.$watch('baseDeliveries', function () {
            init();
            $scope.tableParams.reload();
        }, true);

    }]);
