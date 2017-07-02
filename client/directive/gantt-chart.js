angular.module('plan').directive('ganttChart', function () {
    return {
        scope: {
            data: '=ganttChart'
        },
        templateUrl: 'partials/directive/gantt-chart.html',
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Calcul des min et des max
            $scope.$watch('data', function (data) {
                data = angular.copy(data);

                $scope.minimum = null;
                $scope.maximum = null;

                angular.forEach(data, function (row) {
                    if (($scope.minimum === null && row.startDate) || row.startDate < $scope.minimum) {
                        $scope.minimum = row.startDate;
                    }

                    if (($scope.maximum === null && row.plannedDate) || row.plannedDate > $scope.maximum) {
                        $scope.maximum = row.plannedDate;
                    }

                    if (($scope.maximum === null && row.endDate) || row.endDate > $scope.maximum) {
                        $scope.maximum = row.endDate;
                    }
                });


                $scope.ranges = [];
                $scope.rows = [];
                var ranges = [];
                if ($scope.maximum !== null && $scope.minimum !== null && $scope.maximum.getTime() !== $scope.minimum.getTime()) {
                    ranges.push($scope.minimum);

                    var rangeInterval = Math.floor(($scope.maximum.getTime() - $scope.minimum.getTime()) / 4);
                    for (var i = 1; i <= 4; i++) {
                        var range = new Date($scope.minimum.getTime() + i * rangeInterval);
                        ranges.push(range);
                    }

                    angular.forEach(ranges, function (rangeValue) {
                        var percent = (rangeValue.getTime() - $scope.minimum.getTime()) / ($scope.maximum.getTime() - $scope.minimum.getTime()) * 100;
                        $scope.ranges.push({
                            value: rangeValue,
                            percent: percent + '%'
                        });
                    });
                }

                if ($scope.maximum !== null && $scope.minimum !== null && $scope.maximum.getTime() !== $scope.minimum.getTime()) {
                    angular.forEach(data, function (row) {
                        var
                            startPercent = (row.startDate.getTime() - $scope.minimum.getTime()) / ($scope.maximum.getTime() - $scope.minimum.getTime()) * 100,
                            plannedPercent = row.plannedDate ? (row.plannedDate.getTime() - row.startDate.getTime()) / ($scope.maximum.getTime() - $scope.minimum.getTime()) * 100 : 100,
                            endPercent = (row.endDate.getTime() - row.startDate.getTime()) / (row.plannedDate.getTime() - row.startDate.getTime()) * 100;
                        $scope.rows.push({
                            color: row.color ? row.color : '#cccccc',
                            startPercent: startPercent + '%',
                            plannedPercent: plannedPercent + '%',
                            endPercent: endPercent + '%',
                            hover: row.hover,
                            title: row.title,

                            orderDate: row.plannedDate ? row.plannedDate.getTime() : 0
                        });
                    });
                }


                if ($scope.maximum !== null && $scope.minimum !== null && $scope.maximum.getTime() !== $scope.minimum.getTime()) {
                    var currentDate = new Date();
                    $scope.currentDatePercent = ((currentDate.getTime() - $scope.minimum.getTime()) / ($scope.maximum.getTime() - $scope.minimum.getTime()) * 100) + '%';
                }

                $scope.rows = $filter('orderBy')($scope.rows, 'orderDate');
            }, true);
        }]
    };
});
