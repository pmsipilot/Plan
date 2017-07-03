angular.module('plan').controller('ServiceFormController', ['$scope', '$location', 'service', 'AngularDataStore',
    function ($scope, $location, service, AngularDataStore) {
        $scope.service = service;

        if (service.name === 'slackbot' && !service.config.public_url) {
            service.config.public_url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        }

        $scope.save = function () {
            AngularDataStore.save($scope.service);
            $location.path('/service');
        };
    }
]);
