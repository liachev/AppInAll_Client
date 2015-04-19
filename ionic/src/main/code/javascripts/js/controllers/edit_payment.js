angular.module('editPayment.controllers', ['credit-cards'])

.filter('yesNo', function () {
    return function (boolean) {
        return boolean ? 'Yes' : 'No';
    }
})

.controller('EditPaymentCtrl', ['$rootScope', '$http', '$window', function ($scope, $http, $window) {
    $scope.editPaymentData = {};
    $scope.card = {};

    $http.get('translate/settings/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    $scope.reset = function (editPaymentForm) {
        if (editPaymentForm) {
            editPaymentForm.$setPristine();
            editPaymentForm.$setUntouched();
        }
        $scope.editPaymentData = {};
    };

    $scope.cancelButtonClick = function(){
        $window.history.back();
        $scope.reset();//
    };

    $scope.save = function (form) {
        var number = $scope.card.number;
        var length = number.length - 4;
        var pad = "";
        for (var i = 0; i < length; i++) {
            pad = pad + "*";
        }
        number = pad + number.substring(length);
        if (!$scope.card) {
            $scope.card = {
                type: form.cardNumber.$ccType,
                number: number
            }
        } else {
            $scope.card.type = form.cardNumber.$ccType;
            $scope.card.number = number;
        }
        $window.history.back();
    };
}]);