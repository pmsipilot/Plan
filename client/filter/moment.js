angular.module('pmsiplan').filter('moment', function () {
    return function (input) {
        return input ? moment(input).format('LL') : '';
    };
});
