angular.module('pmsiplan').controller('ProjectFormController', ['$scope', '$location', 'project', 'projects', 'AngularDataStore', 'ServiceFactory',
    function($scope, $location, project, projects, AngularDataStore, ServiceFactory) {
    $scope.project  = project;
    $scope.projects = projects.filter(function (current) {
        return current._id !== project._id;
    });

    $scope.save = function() {
        AngularDataStore.save($scope.project);
        $location.path('/project');
    };

    // Services
    ServiceFactory.getService('gitlab').then(function(gitlab) {
        $scope.gitlab = gitlab;
    });
}]);