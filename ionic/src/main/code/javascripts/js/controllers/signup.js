angular.module('signup.controllers', [])

.controller('SignUpCtrl', ['$rootScope', '$http', 'ParseSDK', function($scope, $http, Parse) {
    $scope.signupData = {};

    $http.get('translate/signup/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    $scope.signUp = function (signupForm) {
        var users = new (Parse.Collection.getClass("TestUser")); // TODO: must be changed later
        users.addUser($scope.signupData.firstName,
                      $scope.signupData.secondName,
                      $scope.signupData.email,
                      $scope.signupData.password)
            .then(function (success) {
                if (success) {
                    $scope.reset(signupForm);
                    alert("Congratulation! You are successfully registered");
                } else {
                    alert("Smth wrong!");
                    console.debug(success);
                }
            });
    };

    $scope.reset = function (signupForm) {
        if (signupForm) {
            signupForm.$setPristine();
            signupForm.$setUntouched();
        }
        $scope.signupData = {};
    };

    $scope.connectWithFacebook = function () {
        alert('Not implemented yet.'); // TODO: complete connect with Facebook
    };
}]);