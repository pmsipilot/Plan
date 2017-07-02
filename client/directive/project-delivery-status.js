angular.module('plan').directive('projectDeliveryStatus', function () {
    return {
        scope: { status: '=projectDeliveryStatus' },
        templateUrl: 'partials/directive/project-delivery-status.html'
    };
});
