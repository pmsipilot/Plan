angular.module('plan', [
    'angular-datastore',
    'ngRoute',
    'ngSanitize',
    'ngTable',
    'ui.bootstrap',
    'authenticate.js',
    'hc.marked',
    'ui.gravatar'
])
    .config(['AuthenticateJSProvider', function (AuthenticateJSProvider) {
        AuthenticateJSProvider.setConfig({
            host: '/',                          // your base api url
            loginUrl: 'ldap/auth/login',        // login api url
            logoutUrl: 'api/auth/logout',       // logout api url
            loggedinUrl: 'api/auth/loggedin',   // api to get the user profile and roles

            unauthorizedPage: '/unauthorized',  // url (frontend) of the unauthorized page
            targetPage: '/',                    // url (frontend) of the target page on login success
            loginPage: '/login'                 // url (frontend) of the login page
        });
    }])
    .config(['markedProvider', function (markedProvider) {
        markedProvider.setOptions({
            gfm: true,
            tables: true
        });
    }])
    .config(['AngularDataRestAdapterProvider', function (AngularDataRestAdapterProvider) {
        AngularDataRestAdapterProvider.setBaseUrl('api');
    }])
    .config(['AngularDataStoreProvider', function (AngularDataStoreProvider) {
        AngularDataStoreProvider.setSocketIOBaseUrl('/');

        AngularDataStoreProvider.addModel({
            name: 'project',
            fields: {
                _id: { type: 'integer' },
                name: { type: 'string' },
                description: { type: 'string' },
                color: { type: 'string' },
                project_owner: { type: 'string' },
                scrum_master: { type: 'string' },
                repository: { type: 'string' },
                type: { type: 'string' },
                extra: { type: 'mixed' }
            },
            hasMany: {
                dependancies: { type: 'id', target: 'project' }
            },
            primaryKey: '_id'
        });

        AngularDataStoreProvider.addModel({
            name: 'delivery',
            fields: {
                _id: { type: 'integer' },
                version: { type: 'string' },
                locked: { type: 'boolean' },
                description: { type: 'string' }
            },
            primaryKey: '_id'
        });

        AngularDataStoreProvider.addModel({
            name: 'project_delivery',
            fields: {
                _id: { type: 'integer' },
                version: { type: 'string' },
                status: { type: 'string' },
                start_date: { type: 'date' },
                target_date: { type: 'date' },
                end_date: { type: 'date' },
                features: { type: 'string' }
            },
            hasOne: {
                project: { type: 'id', target: 'project' },
                delivery: { type: 'id', target: 'delivery' }
            },
            primaryKey: '_id'
        });

        AngularDataStoreProvider.addModel({
            name: 'service',
            fields: {
                _id: { type: 'integer' },
                name: { type: 'string' },
                enabled: { type: 'boolean' },
                config: { type: 'mixed' }
            },
            primaryKey: '_id'
        });

        AngularDataStoreProvider.addModel({
            name: 'histo',
            fields: {
                _id: { type: 'integer' },
                resource: { type: 'string' },
                action: { type: 'string' },
                date: { type: 'date' },
                content: { type: 'string' },
                username: { type: 'string' }
            },
            primaryKey: '_id'
        });
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/status', {
                templateUrl: 'partials/status.html',
                controller: 'StatusController',
                resolve: {
                    deliveries: ['$http', function ($http) {
                        return $http.get('/dashboard').then(function (response) {
                            return response.data;
                        });
                    }]
                },
                security: false,
                active: 'status'
            })

            .when('/timeline', {
                templateUrl: 'partials/timeline.html',
                controller: 'TimelineController',
                resolve: {
                    history: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('histo');
                    }]
                },
                security: true,
                active: 'timeline'
            })

            .when('/project', {
                templateUrl: 'partials/projects.html',
                controller: 'ProjectsController',
                resolve: {
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }]
                },
                security: true,
                active: 'project'
            })

            .when('/project/new', {
                templateUrl: 'partials/project-form.html',
                controller: 'ProjectFormController',
                resolve: {
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    project: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.create('project');
                    }]
                },
                security: true,
                active: 'project'
            })

            .when('/project/:id/edit', {
                templateUrl: 'partials/project-form.html',
                controller: 'ProjectFormController',
                resolve: {
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    project: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('project', $route.current.params.id);
                    }]
                },
                security: true,
                active: 'project'
            })

            .when('/project/:id', {
                templateUrl: 'partials/project.html',
                controller: 'ProjectController',
                resolve: {
                    project: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('project', $route.current.params.id);
                    }],
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    deliveries: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('delivery');
                    }],
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }]
                },
                security: true,
                active: 'project'
            })

            .when('/project/:id/dependencies', {
                templateUrl: 'partials/project-dependencies.html',
                controller: 'ProjectController',
                resolve: {
                    project: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('project', $route.current.params.id);
                    }],
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    deliveries: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('delivery');
                    }],
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }]
                },
                security: true,
                active: 'project'
            })

            .when('/delivery', {
                templateUrl: 'partials/deliveries.html',
                controller: 'DeliveriesController',
                resolve: {
                    deliveries: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('delivery');
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/delivery/new', {
                templateUrl: 'partials/delivery-form.html',
                controller: 'DeliveryFormController',
                resolve: {
                    delivery: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.create('delivery');
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/delivery/:id/edit', {
                templateUrl: 'partials/delivery-form.html',
                controller: 'DeliveryFormController',
                resolve: {
                    delivery: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('delivery', $route.current.params.id);
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/delivery/:id', {
                templateUrl: 'partials/delivery.html',
                controller: 'DeliveryController',
                resolve: {
                    delivery: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('delivery', $route.current.params.id);
                    }],
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    projectDeliveries: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.findBy('project_delivery', { delivery: $route.current.params.id });
                    }],
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/delivery/:id/gantt', {
                templateUrl: 'partials/delivery-gantt.html',
                controller: 'DeliveryGanttController',
                resolve: {
                    delivery: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('delivery', $route.current.params.id);
                    }],
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    projectDeliveries: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.findBy('project_delivery', { delivery: $route.current.params.id });
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/delivery/:id/dependencies', {
                templateUrl: 'partials/delivery-dependancies.html',
                controller: 'DeliveryController',
                resolve: {
                    delivery: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.find('delivery', $route.current.params.id);
                    }],
                    projects: ['AngularDataStore', function (AngularDataStore) {
                        return AngularDataStore.findAll('project');
                    }],
                    projectDeliveries: ['$route', 'AngularDataStore', function ($route, AngularDataStore) {
                        return AngularDataStore.findBy('project_delivery', { delivery: $route.current.params.id });
                    }],
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }]
                },
                security: true,
                active: 'delivery'
            })

            .when('/service', {
                templateUrl: 'partials/services.html',
                controller: 'ServicesController',
                resolve: {
                    gitlab: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('gitlab');
                    }],
                    slackbot: ['ServiceFactory', function (ServiceFactory) {
                        return ServiceFactory.getService('slackbot');
                    }]
                },
                security: true,
                active: 'service'
            })

            .when('/service/:name/edit', {
                templateUrl: 'partials/service-form.html',
                controller: 'ServiceFormController',
                resolve: {
                    service: ['$route', 'ServiceFactory', function ($route, ServiceFactory) {
                        return ServiceFactory.getService($route.current.params.name);
                    }]
                },
                security: true,
                active: 'service'
            })

            .when('/login', {
                templateUrl: 'partials/login.html',
                security: false
            })

            .otherwise({
                redirectTo: '/status'
            });
    }])
;
