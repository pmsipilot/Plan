angular.module('pmsiplan').controller('DeliveryController', ['$scope', '$filter', '$location', 'AngularDataStore', 'ServiceFactory', 'delivery', 'projects', 'ngTableParams',
    function ($scope, $filter, $location, AngularDataStore, ServiceFactory, delivery, projects, ngTableParams) {
        $scope.delivery = delivery;
        $scope.projects = projects;
        $scope.deliveryProjects = [];

        // Services
        ServiceFactory.getService('gitlab').then(function(gitlab) {
            $scope.gitlab = gitlab;
        });

        $scope.removeDelivery = function () {
            if (confirm('Are you sure you want to delete this delivery ?')) {
                AngularDataStore.remove($scope.delivery);
                $location.path('/delivery');
            }
        };

        $scope.deliveryProjects = [];
        AngularDataStore.findBy('project_delivery', {delivery: delivery.getPrimaryKey()}).then(function(projectDeliveries) {
            var computeDeliveryProjects = function () {
                $scope.deliveryProjects.splice(0, $scope.deliveryProjects.length);
                angular.forEach(projectDeliveries, function (prDelivery) {
                    var deliveryProject = {
                        primaryKey: null,
                        color: null,
                        name: null,
                        poSm: null,
                        version: prDelivery.version,
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
                        deliveryProject.poSm = (project.project_owner ? project.project_owner : '') + '/' + (project.scrum_master ? project.scrum_master : '');
                        deliveryProject.project = project;
                    });
                });
            };

            computeDeliveryProjects();

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 100,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: $scope.deliveryProjects.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.filter() ? $filter('filter')($scope.deliveryProjects, params.filter()) : $scope.deliveryProjects;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                },
                $scope: { $data: {} },
                debugMode: false
            });

            $scope.$watch('projects', function () {
                computeDeliveryProjects();
            }, true);

            $scope.$watch('delivery', function () {
                computeDeliveryProjects();
            }, true);

            $scope.$watch('deliveryProjects', function () {
                $scope.tableParams.reload();
            }, true);

        });
    }]);
