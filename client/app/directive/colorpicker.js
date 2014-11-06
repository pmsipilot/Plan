angular.module('pmsiplan').directive('colorpicker', [function() {
    return {
        require: 'ngModel',
        scope: false,
        link: function(scope, element, attrs, ngModel) {
            var options = angular.extend({
                preferredFormat: "hex",
                showInput: true,
                color: ngModel.$viewValue,
                change: function(color) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(color.toHexString());
                    });
                }
            }, scope.$eval(attrs.options));
            ngModel.$render = function() {
                element.spectrum('set', ngModel.$viewValue || '');
            };

            element.spectrum(options);
        }
    };
}]);