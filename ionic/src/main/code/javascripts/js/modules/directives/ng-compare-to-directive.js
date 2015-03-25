angular.module('starter')

.directive('ngCompareTo', function() {
    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            otherModelValue: "=ngCompareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});