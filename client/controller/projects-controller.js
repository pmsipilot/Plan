angular.module('pmsiplan').controller('ProjectsController', ['$scope', '$filter', 'AngularDataStore', 'projects', 'NgTableParams',
    function($scope, $filter, AngularDataStore, projects, NgTableParams) {
    $scope.projects = projects;

    $scope.removeProject = function(project) {
        if (confirm('Are you sure you want to delete this project ?')) {
            AngularDataStore.remove(project);
        }
    };
        
    $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 100,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
        dataset: $scope.projects
    });

    $scope.$watch('projects', function() {
        $scope.tableParams.reload();
    }, true);

}]);