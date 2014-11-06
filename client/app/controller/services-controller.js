angular.module('pmsiplan').controller('ServicesController', ['$scope', '$filter', 'ServiceFactory', 'ngTableParams',
    function($scope, $filter, ServiceFactory, ngTableParams) {

        $scope.services = [];
        ServiceFactory.getService('gitlab').then(function(service) {
            $scope.services.push(service);
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 100,          // count per page
            sorting: {
                version: 'desc'     // initial sorting
            }
        }, {
            total: $scope.services.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ? $filter('filter')($scope.services, params.filter()) : $scope.services;
                orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {} },
            debugMode: false
        });
        
        $scope.$watch('services', function () {
            $scope.tableParams.reload();
        }, true);
}]);