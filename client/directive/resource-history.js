angular.module('pmsiplan').directive('resourceHistory', ['AngularDataStore', function(AngularDataStore) {
    return {
        templateUrl: 'partials/directive/resource-history.html',
        scope: {
            id: '=id',
            entries: '=entries'
        },
        link: function(scope, element, attrs) {
            var nbEntryPerPage = 25,
                projects = {},
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
                callback = function(entries) {
                    entries = entries
                        .sort(function (a, b) {
                            if (a.date < b.date) {
                                return 1;
                            }

                            if (a.date > b.date) {
                                return -1;
                            }


                            return 0;
                        })
                        .map(function(entry) {
                            try {
                                entry.content = JSON.parse(entry.content);
                            } catch(err) {}

                            return entry;
                        });

                    if (scope.id) {
                        entries = entries.filter(function(entry) {
                            return entry.content._id === scope.id;
                        });
                    }

                    scope.nbPages = Math.ceil(entries.length / nbEntryPerPage);

                    if(scope.page + 1 > scope.nbPages) {
                        return;
                    }

                    scope.history = scope.history.concat(entries
                        .slice(nbEntryPerPage * scope.page, nbEntryPerPage * (scope.page + 1))
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
                        })
                    );
                };

            scope.history = [];
            scope.page = 0;
            scope.fetch = function() {
                if(attrs.type && !scope.entries) {
                    scope.type = attrs.type;

                    AngularDataStore.findBy('histo', { resource: attrs.type }).then(function(entries) {
                        scope.entries = entries;

                        callback(scope.entries);
                    });
                }

                if(scope.entries) {
                    callback(scope.entries);
                }
            };
            scope.more = function() {
                scope.page = scope.page + 1;

                scope.fetch();
            };
            scope.isProperty = function(obj, prop) {
                return ['function', 'object'].indexOf(typeof obj[prop]) === -1 && prop !== '_id';
            };

            scope.fetch();
        }
    };
}]);
