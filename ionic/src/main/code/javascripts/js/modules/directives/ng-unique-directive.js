angular.module('starter')

.directive('ngUnique', ['$log', 'AuthService', 'ParseSDK', function($log, AuthService, Parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('input', function (e) {
                if (!ngModel || !element.val()) return;
                var keyProperty = scope.$eval(attrs.ngUnique);
                var currentValue = element.val();
                AuthService.checkUniqueValue(keyProperty.key, keyProperty.property, currentValue,
                    function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if ((currentValue == element.val())) {
                            $log.debug('unique = '+unique);
                            ngModel.$setValidity('unique', unique && (currentValue != ""));
                            scope.$broadcast('show-errors-check-validity');
                        };
                    });
            });
        }
    };
}]);