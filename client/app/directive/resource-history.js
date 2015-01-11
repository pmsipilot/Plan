angular.module('pmsiplan').directive('resourceHistory', ['AngularDataStore', function(AngularDataStore) {
    return {
        templateUrl: 'partials/directive/resource-history.html',
        scope: {
            resourceId: '=id',
            historyEntries: '=history'
        },
        link: function(scope, element, attrs) {
            var projects = {},
                deliveries = {},
                getDelivery = function(entry) {
                    if(deliveries[entry.content.delivery]) {
                        entry.delivery = deliveries[entry.content.delivery];
                    } else {
                        AngularDataStore.findBy('delivery', {_id: entry.content.delivery}).then(function(delivs) {
                            deliveries[entry.content.delivery] = delivs[0];

                            entry.delivery = deliveries[entry.content.delivery];
                        });
                    }
                },
                getProject = function(entry) {
                    if(projects[entry.content.project]) {
                        entry.project = projects[entry.content.project];
                    } else {
                        AngularDataStore.findBy('project', {_id: entry.content.project}).then(function(proj) {
                            projects[entry.content.project] = proj[0];

                            entry.project = projects[entry.content.project];
                        });
                    }
                },
                callback = function(history) {
                    scope.history = history
                        .map(function(entry) {
                            entry.content = JSON.parse(entry.content);

                            return entry;
                        })
                        .filter(function(entry) {
                            return !scope.resourceId || entry.content._id === scope.resourceId;
                        })
                        .map(function(entry) {
                            entry.showContent = function() {
                                if (!entry.isContentVisible) {
                                    if(entry.content.project) {
                                        getProject(entry);
                                    }

                                    if(entry.content.delivery) {
                                        getDelivery(entry);
                                    }
                                }

                                entry.isContentVisible = !entry.isContentVisible;
                            };

                            if(entry.resource == 'project_delivery') {
                                getProject(entry);
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

            scope.isProperty = function(obj, prop) {
                return typeof obj[prop] === "string";
            };
        }
    };
}]);
