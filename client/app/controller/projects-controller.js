angular.module('pmsiplan').controller('ProjectsController', ['$scope', '$filter', 'AngularDataStore', 'projects', 'ngTableParams',
    function($scope, $filter, AngularDataStore, projects, ngTableParams) {

    $scope.projects = projects;

    $scope.removeProject = function(project) {
        if (confirm('Are you sure you want to delete this project ?')) {
            AngularDataStore.remove(project);
        }
    };
        
    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 100,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        total: $scope.projects.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.filter() ? $filter('filter')($scope.projects, params.filter()) : $scope.projects;
            orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });

    $scope.$watch('projects', function() {
        $scope.tableParams.reload();
    }, true);

}]);