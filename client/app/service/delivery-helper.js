angular
    .module('pmsiplan')
    .factory('DeliveryHelper', ['$q', 'AngularDataStore', function ServiceFactory ($q, AngularDataStore) {

    return {
        isReady: function (delivery) {
            return AngularDataStore.findBy('project_delivery', {delivery: delivery.getPrimaryKey()}).then(function(projectDeliveries) {
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
            promises.push(AngularDataStore.findBy('project_delivery', { delivery: delivery.getPrimaryKey() }).then(function(projectDeliveries) {
                angular.forEach(projectDeliveries, function(projectDelivery) {
                    promises.push(projectDelivery.getProject().then(function(pr) {
                        if (project.getPrimaryKey() !== pr.getPrimaryKey() && project.dependancies.indexOf(pr.getPrimaryKey()) !== -1 ) {
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
