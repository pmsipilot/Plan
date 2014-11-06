angular.module('pmsiplan').filter('nl2br', ['$sce', function ($sce) {
    return function (input) {
        if (input) {
            return $sce.trustAsHtml(input.replace(new RegExp("\n", 'g'), "<br />"));
        }

        return '';
    };
}]);