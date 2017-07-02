angular.module('plan').filter('momentFromNow', function () {
    return function (input) {
        return input ? moment(input).fromNow() : '';
    };
});
