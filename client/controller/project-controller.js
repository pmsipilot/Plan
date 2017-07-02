angular.module('plan').controller('ProjectController', ['$scope', '$location', '$route', 'AngularDataStore', 'DeliveryHelper', 'project', 'deliveries', 'gitlab',
    function($scope, $location, $route, AngularDataStore, DeliveryHelper, project, deliveries, gitlab) {
        $scope.project = project;
        $scope.gitlab = gitlab;
        $scope.project.getDependancies().then(function(dependancies) {
            $scope.dependancies = dependancies;
        });
        var availableDeliveries = deliveries.filter(function(delivery) {
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

                    availableDeliveries = availableDeliveries.filter(function(availableDelivery) {
                        return availableDelivery.getPrimaryKey() !== delivery.getPrimaryKey();
                    });
                });
                return config;
            });
        });

        // Project Delivery Handling
        $scope.projectDelivery = null;
        $scope.isSaving = false;
        $scope.editProjectDelivery = function(projectDelivery) {
            $scope.projectDelivery  = projectDelivery;
            $scope.deliveries = angular.copy(availableDeliveries);
            $scope.deliveries.push(deliveries.find(function(delivery) {
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
    }
]);
