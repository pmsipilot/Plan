angular.module('pmsiplan').controller('ProjectsController', [
    '$scope', '$filter', 'AngularDataStore', 'projects', 'NgTableParams', 'gitlab',
    function ($scope, $filter, AngularDataStore, projects, NgTableParams, gitlab) {
        $scope.gitlab = gitlab;
        $scope.projects = projects;

        $scope.removeProject = function (project) {
            if (confirm('Are you sure you want to delete this project ?')) {
                AngularDataStore.remove(project);
            }
        };

        $scope.tableParams = new NgTableParams(
            {
                page: 1,
                count: 100,
                sorting: {
                    name: 'asc'
                }
            },
            {
                dataset: $scope.projects
            }
        );

        $scope.$on('$destroy', $scope.$watch('projects', function () { $scope.tableParams.reload(); }, true));
    }
]);