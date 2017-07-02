angular.module('plan').controller('DeliveryGanttController', ['$scope', '$location', 'AngularDataStore', 'delivery', 'projects', 'projectDeliveries',
    function($scope, $location, AngularDataStore, delivery, projects, projectDeliveries) {
        $scope.delivery = delivery;
        $scope.projects = projects;
        $scope.toggle = function () {
            delivery.locked = !delivery.locked;
            AngularDataStore.save(delivery);
        };

        $scope.chartData = [];
        var now = new Date();
        angular.forEach(projectDeliveries, function (prDelivery) {
            prDelivery.getProject().then(function (project) {
                var rowConfig = {
                    title: project.name,
                    color: project.color ? project.color : '#339999',
                    startDate: prDelivery.start_date ? prDelivery.start_date : now,
                    endDate: prDelivery.end_date ? prDelivery.end_date : now,
                    plannedDate: prDelivery.target_date ? prDelivery.target_date : now
                };

                rowConfig.hover = '<h3>' + project.name + '</h3>' +
                    'Started at : ' + (prDelivery.start_date ? rowConfig.startDate.toLocaleDateString() : 'NA') + '<br>' +
                    'Delivered at : ' + (prDelivery.end_date ? rowConfig.endDate.toLocaleDateString() : 'NA') + '<br>' +
                    'Planned for : ' + (prDelivery.target_date ? rowConfig.plannedDate.toLocaleDateString() : 'NA');

                $scope.chartData.push(rowConfig);
            });
        });
    }
]);
