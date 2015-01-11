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
                    .map(function(entry) {
                        entry.content = JSON.parse(entry.content);

                        return entry;
                    })
                    .filter(function(entry) {
                        return !scope.resourceId || entry.content._id === scope.resourceId;
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
