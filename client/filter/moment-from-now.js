angular.module('pmsiplan').filter('momentFromNow', function () {
    return function (input) {
        return input ? moment(input).fromNow() : '';
    };
});
