angular.module('plan').factory('DeliveryHelper', ['$q', 'AngularDataStore', function ($q, AngularDataStore) {
    var getPrimaryKey = function (entity) {
        if (entity.getPrimaryKey) {
            return entity.getPrimaryKey();
        }

        return entity._id ? entity._id.toString() : entity.id;
    };

    return {
        progress: function (delivery) {
            return AngularDataStore.findBy('project_delivery', { delivery: getPrimaryKey(delivery) }).then(function (projectDeliveries) {
                var nbProjects = projectDeliveries.length;
                var nbDeliveredProjects = 0;

                angular.forEach(projectDeliveries, function (prDelivery) {
                    if (prDelivery.status === 'delivered') {
                        nbDeliveredProjects++;
                    }
                });

                return nbDeliveredProjects / nbProjects;
            });
        },

        isReady: function (delivery) {
            return AngularDataStore.findBy('project_delivery', { delivery: getPrimaryKey(delivery) }).then(function (projectDeliveries) {
                var ready = true;
                angular.forEach(projectDeliveries, function (prDelivery) {
                    if (prDelivery.status !== 'delivered') {
                        ready = false;
                    }
                });
                return ready;
            });
        },

        getProjectDependenciesRequirements: function (project, delivery) {
            var dependanciesConfig = [],
                promises = [],
                defer = $q.defer();
            promises.push(AngularDataStore.findBy('project_delivery', { delivery: getPrimaryKey(delivery) }).then(function (projectDeliveries) {
                angular.forEach(projectDeliveries, function (projectDelivery) {
                    promises.push(projectDelivery.getProject().then(function (pr) {
                        if (getPrimaryKey(project) !== getPrimaryKey(pr) && project.dependancies.indexOf(getPrimaryKey(pr)) !== -1) {
                            dependanciesConfig.push({
                                project: pr,
                                projectDelivery: projectDelivery
                            });
                        }
                    }));
                });
            }));

            $q.all(promises).then(function () {
                defer.resolve(dependanciesConfig);
            }, function () {
                $q.reject();
            });

            return defer.promise;
        },

        getStartAndTargetDates: function (delivery) {
            return AngularDataStore.findBy('project_delivery', { delivery: getPrimaryKey(delivery) })
                .then(function (projectDeliveries) {
                    var start = null;
                    var target = null;

                    angular.forEach(projectDeliveries, function (prDelivery) {
                        if (start === null || start > prDelivery.start_date) {
                            start = prDelivery.start_date;
                        }

                        var endDateIsSet = prDelivery.end_date && prDelivery.end_date < prDelivery.target_date;
                        var endDate = endDateIsSet ? prDelivery.end_date : prDelivery.target_date;

                        if (target === null || target < endDate) {
                            target = endDate;
                        }
                    });

                    return {
                        start_date: start,
                        target_date: target
                    };
                });
        }
    };
}]);
