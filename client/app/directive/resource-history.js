angular.module('pmsiplan').directive('resourceHistory', ['AngularDataStore', function(AngularDataStore) {
    return {
        templateUrl: 'partials/directive/resource-history.html',
        scope: {
            resourceId: '=id',
            historyEntries: '=history'
        },
        link: function(scope, element, attrs) {
            var callback = function(history) {
                scope.history = history
                    .slice(-50)
                    .map(function(entry) {
                        entry.content = JSON.parse(entry.content);

                        return entry;
                    })
                    .filter(function(entry) {
                        return !scope.resourceId || entry.content._id === scope.resourceId;
                    })
                    .map(function(entry) {
                        if(entry.content.project) {
                            AngularDataStore.findBy('project', {_id: entry.content.project}).then(function(projects) {
                                entry.project = projects[0];
                            });
                        }

                        if(entry.content.delivery) {
                            AngularDataStore.findBy('delivery', {_id: entry.content.delivery}).then(function(deliveries) {
                                entry.delivery = deliveries[0];
                            });
                        }

                        return entry;
                    });
            };

            if(attrs.type) {
                scope.type = attrs.type;

                AngularDataStore.findBy('histo', { resource: attrs.type }).then(callback);
            }

            if(scope.historyEntries) {
                callback(scope.historyEntries);
            }
        }
    };
}]);
