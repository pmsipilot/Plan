angular.module('pmsiplan').directive('resourceHistory', ['AngularDataStore', function(AngularDataStore) {
    return {
        templateUrl: 'partials/directive/resource-history.html',
        scope: {
            resourceId: '=id'
        },
        link: function(scope, element, attrs) {
            AngularDataStore.findBy('histo', { resource: attrs.type }).then(function(history) {
                scope.history = history
                    .map(function(entry) {
                        entry.content = JSON.parse(entry.content);

                        return entry;
                    })
                    .filter(function(entry) {
                        return entry.content._id === scope.resourceId;
                    });
            });
        }
    };
}]);
