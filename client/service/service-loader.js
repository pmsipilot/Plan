angular
    .module('pmsiplan')
    .factory('ServiceLoader', ['AngularDataStore', function (AngularDataStore) {
        return {
            get: function () {
                return AngularDataStore.findAll('service');
            },

            getService: function (name) {
                return this.get().then(function (services) {
                    return services.find(function(service) {
                        return service.name === name;
                    });
                });
            }
        };
    }]);