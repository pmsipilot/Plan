angular
    .module('pmsiplan')
    .factory('ServiceLoader', ['AngularDataStore', function ServiceLoader (AngularDataStore) {

    var promise;

    return {
        get: function () {
            if (!promise) {
                promise = AngularDataStore.findAll('service');
            }

            return promise;
        },

        getService: function (name) {
            return this.get().then(function (services) {
                return _.find(services, {name: name});
            });
        }
    };
}]);