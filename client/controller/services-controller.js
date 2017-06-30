angular.module('pmsiplan').controller('ServicesController', ['$scope', '$filter', 'ServiceFactory', 'NgTableParams',
    function($scope, $filter, ServiceFactory, NgTableParams) {

        $scope.services = [];
        ServiceFactory.getService('gitlab').then(function(service) {
            $scope.services.push(service);
        });

        $scope.tableParams = new NgTableParams({
            page: 1,            // show first page
            count: 100,          // count per page
            sorting: {
                version: 'desc'     // initial sorting
            }
        }, {
            dataset: $scope.services
        });
        
        $scope.$watch('services', function () {
            $scope.tableParams.reload();
        }, true);
}]);