angular.module('plan').controller('ProjectFormController', [
    '$scope', '$location', 'project', 'projects', 'AngularDataStore',
    function ($scope, $location, project, projects, AngularDataStore) {
        $scope.project = project;
        $scope.projects = projects.filter(function (current) {
            return current._id !== project._id;
        });

        $scope.save = function () {
            AngularDataStore.save($scope.project);
            $location.path('/project');
        };
    }
]);
