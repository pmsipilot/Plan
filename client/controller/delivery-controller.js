angular.module('plan').controller('DeliveryController', [
    '$scope', '$filter', '$location', 'AngularDataStore', 'ServiceFactory', 'delivery', 'projects', 'NgTableParams',
    'gitlab', 'projectDeliveries',
    function ($scope, $filter, $location, AngularDataStore, ServiceFactory, delivery, projects, NgTableParams,
              gitlab, projectDeliveries) {
        $scope.delivery = delivery;
        $scope.projects = projects;
        $scope.deliveryProjects = [];
        $scope.gitlab = gitlab;

        $scope.toggle = function () {
            delivery.locked = !delivery.locked;
            AngularDataStore.save(delivery);
        };

        $scope.projectDeliveries = projectDeliveries;

        var computeDeliveryProjects = function () {
            $scope.deliveryProjects.splice(0, $scope.deliveryProjects.length);
            angular.forEach(projectDeliveries, function (prDelivery) {
                var deliveryProject = {
                    primaryKey: null,
                    color: null,
                    name: null,
                    poSm: null,
                    version: prDelivery.version,
                    features: prDelivery.features,
                    startDate: prDelivery.start_date,
                    endDate: prDelivery.end_date,
                    plannedDate: prDelivery.target_date,
                    status: prDelivery.status
                };
                $scope.deliveryProjects.push(deliveryProject);

                prDelivery.getProject().then(function (project) {
                    deliveryProject.primaryKey = project.getPrimaryKey();
                    deliveryProject.color = project.color ? project.color : '#339999';
                    deliveryProject.name = project.name;
                    deliveryProject.poSm = (project.project_owner || 'N.A') + '/' + (project.scrum_master || 'N/A');
                    deliveryProject.project = project;
                });
            });
        };

        computeDeliveryProjects();

        $scope.tableParams = new NgTableParams(
            {
                page: 1,
                count: 100,
                sorting: {
                    name: 'asc'
                }
            },
            {
                dataset: $scope.deliveryProjects
            }
        );

        $scope.$on('$destroy', $scope.$watch('projects', function () { computeDeliveryProjects(); }, true));
        $scope.$on('$destroy', $scope.$watch('delivery', function () { computeDeliveryProjects(); }, true));
        $scope.$on('$destroy', $scope.$watch('deliveryProjects', function () { $scope.tableParams.reload(); }, true));
    }
]);
