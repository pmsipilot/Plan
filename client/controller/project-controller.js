angular.module('pmsiplan').controller('ProjectController', ['$scope', '$location', '$route', 'AngularDataStore', 'DeliveryHelper', 'project', 'deliveries', 'ServiceFactory',
    function($scope, $location, $route, AngularDataStore, DeliveryHelper, project, deliveries, ServiceFactory) {
        $scope.project = project;
        $scope.project.getDependancies().then(function(dependancies) {
            $scope.dependancies = dependancies;
        });
        ServiceFactory.getService('gitlab').then(function(gitlab) {
            $scope.gitlab = gitlab;
        });
        var availableDeliveries = _.filter(deliveries, function(delivery) {
            return !delivery.locked;
        });
        AngularDataStore.findBy('project_delivery', { project: $scope.project.getPrimaryKey() }).then(function(projectDeliveries) {
            $scope.projectDeliveries = projectDeliveries.map(function(projectDelivery) {
                var config = { projectDelivery: projectDelivery };
                projectDelivery.getDelivery().then(function(delivery) {
                    config.delivery = delivery;
                    DeliveryHelper.getProjectDependenciesRequirements($scope.project, delivery).then(function(dependencies) {
                        config.dependencies = dependencies;
                    });
                    _.pull(availableDeliveries, delivery);
                });
                return config;
            });
        });

        // Delete projects
        $scope.remove = function() {
            if (confirm('Are you sure you want to delete this project ?')) {
                AngularDataStore.remove($scope.project);
                $location.path('/project');
            }
        };

        // Project Delivery Handling
        $scope.projectDelivery = null;
        $scope.isSaving = false;
        $scope.deliveryStatuses = ['planned', 'current', 'blocked', 'delivered'];
        $scope.editProjectDelivery = function(projectDelivery) {
            $scope.projectDelivery  = projectDelivery;
            $scope.deliveries = angular.copy(availableDeliveries);
            $scope.deliveries.push(_.find(deliveries, function(delivery) {
                return delivery.getPrimaryKey() === projectDelivery.delivery;
            }));
        };
        $scope.addDelivery = function() {
            if ($scope.projectDelivery === null) {
                $scope.projectDelivery = AngularDataStore.create('project_delivery', {
                    status: 'planned',
                    delivery: availableDeliveries.length ? availableDeliveries[0].getPrimaryKey() : '',
                    project: $scope.project.getPrimaryKey()
                });
                $scope.deliveries = availableDeliveries;
            }
        };

        $scope.doAddDelivery = function() {
            if (!$scope.isSaving) {
                $scope.isSaving = true;
                AngularDataStore.save($scope.projectDelivery).then(function() {
                    $scope.isSaving = false;
                    $scope.projectDelivery = null;
                    $route.reload();
                });
            }
        };


    }]);
