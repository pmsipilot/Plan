angular.module('pmsiplan').controller('DeliveryFormController', ['$scope', '$location', 'delivery', 'AngularDataStore',
    function($scope, $location, delivery, AngularDataStore) {
        if (delivery.locked) {
            throw Error('delivery locked');
        }

        $scope.delivery = delivery;

        $scope.save = function() {
            AngularDataStore.save($scope.delivery);
            $location.path('/delivery');
        };
    }]);
