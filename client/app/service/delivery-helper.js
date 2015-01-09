angular
    .module('pmsiplan')
    .factory('DeliveryHelper', ['$q', 'AngularDataStore', function ServiceFactory ($q, AngularDataStore) {

    var getPrimaryKey = function(entity) {
        return entity.getPrimaryKey ? entity.getPrimaryKey() : entity._id.toString();
    };

    return {
        progress: function (delivery) {
            return AngularDataStore.findBy('project_delivery', {delivery: getPrimaryKey(delivery)}).then(function(projectDeliveries) {
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
            return AngularDataStore.findBy('project_delivery', {delivery: getPrimaryKey(delivery)}).then(function(projectDeliveries) {
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
            promises.push(AngularDataStore.findBy('project_delivery', {delivery: getPrimaryKey(delivery)}).then(function(projectDeliveries) {
                angular.forEach(projectDeliveries, function(projectDelivery) {
                    promises.push(projectDelivery.getProject().then(function(pr) {
                        if (getPrimaryKey(project) !== getPrimaryKey(pr) && project.dependancies.indexOf(getPrimaryKey(pr)) !== -1 ) {
                            dependanciesConfig.push({
                                project: pr,
                                projectDelivery: projectDelivery
                            });
                        }
                    }));
                });
            }));

            $q.all(promises).then(function() {
                defer.resolve(dependanciesConfig);
            }, function() {
                $q.reject();
            });

            return defer.promise;
        }
    };
}]);
