angular.module('plan').filter('moment', function () {
    return function (input) {
        return input ? moment(input).format('LL') : '';
    };
});
