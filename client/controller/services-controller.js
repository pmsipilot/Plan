angular.module('pmsiplan').controller('ServicesController', ['$scope', 'NgTableParams', 'gitlab', 'slackbot',
    function($scope, NgTableParams, gitlab, slackbot) {
        $scope.services = [gitlab, slackbot];
        $scope.tableParams = new NgTableParams(
            {
                page: 1,
                count: 100,
                sorting: {
                    version: 'desc'
                }
            },
            {
                dataset: $scope.services
            }
        );
        
        $scope.$on('$destroy', $scope.$watch('services', function () { $scope.tableParams.reload(); }, true));
}]);