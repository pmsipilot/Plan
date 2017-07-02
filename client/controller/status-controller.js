angular.module('plan').controller('StatusController', ['$scope', '$filter', 'AngularDataStore', 'DeliveryHelper', 'deliveries',
    function ($scope, $filter, AngularDataStore, DeliveryHelper, deliveries) {
        $scope.deliveries = [];

        angular.forEach(deliveries, function(delivery) {
            delivery.progress = delivery.progress || 0;
            delivery.progressPlanned = delivery.progressPlanned || 0;
            delivery.progressCurrent = delivery.progressCurrent || 0;
            delivery.progressBlocked = delivery.progressBlocked || 0;

            DeliveryHelper.getStartAndTargetDates(delivery)
                .then(function (dates) {
                    delivery.start_date = dates.start_date;
                    delivery.target_date = dates.target_date;
                });

            $scope.deliveries.push(delivery);
        });
    }
]);
