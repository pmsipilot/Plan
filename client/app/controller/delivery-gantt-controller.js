angular.module('pmsiplan').controller('DeliveryGanttController', ['$scope', '$location', 'AngularDataStore', 'delivery', 'projects',
    function($scope, $location, AngularDataStore, delivery, projects) {
        $scope.delivery = delivery;
        $scope.projects = projects;
        $scope.removeDelivery = function () {
            if (confirm('Are you sure you want to delete this delivery ?')) {
                AngularDataStore.remove($scope.delivery);
                $location.path('/delivery');
            }
        };

        $scope.lock = function () {
            delivery.locked = true;
            AngularDataStore.save(delivery);
        };

        $scope.unlock = function () {
            delivery.locked = false;
            AngularDataStore.save(delivery);
        };

        $scope.chartData = [];
        var now = new Date();
        AngularDataStore.findBy('project_delivery', {delivery: delivery.getPrimaryKey()}).then(function(projectDeliveries) {
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
        });
    }]);
