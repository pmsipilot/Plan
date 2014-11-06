angular
    .module('pmsiplan')
    .factory('ServiceFactory', ['ServiceLoader', 'AngularDataStore', function ServiceFactory (ServiceLoader, AngularDataStore) {

    return {
        getService: function (name) {
            return ServiceLoader.getService(name).then(function (service) {
                if (service === undefined) {
                    service = AngularDataStore.create('service', {
                        name: 'gitlab',
                        enabled: false,
                        config: {}
                    });
                }
                
                return service;
            });
        }
    };
}]);