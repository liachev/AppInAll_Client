angular.module('signup.controllers', [])

.controller('SignUpCtrl', ['$rootScope', '$http', '$filter', 'fbConnect', 'ParseSDK',
    function($scope, $http, $filter, FB, Parse) {
        $scope.signupData = $scope.debugData = {}; // TODO: delete debugData after Connect with Facebook tested

        $http.get('translate/signup/strings.json').success(function(result) {
            $scope.strings = result;
        }).error(function(object, code) {
            console.warn(object);
        });

        $scope.signUp = function (signupForm) {
            var users = new (Parse.Collection.getClass("_User")); // TODO: must be changed later

            users.addUser($scope.signupData)
                .then(function (success) {
                    alert(angular.toJson(success, true));
                    if (success) {
                        $scope.reset(signupForm);
                        alert("Congratulation! You are successfully registered");
                    } else {
                        alert("Smth wrong!");
                        alert(angular.toJson(success, true));
                    }
                }, function (error) {
                    alert("Smth wrong!");
                    alert(angular.toJson(error, true));
                });
        };

        $scope.reset = function (signupForm) {
            if (signupForm) {
                signupForm.$setPristine();
                signupForm.$setUntouched();
            }
            $scope.signupData = {};
        };

        function fetchUserData(response) {
            if (!response.error) {
                $scope.debugData.name = response.name;
            }
            $scope.debugData.userInfo = angular.toJson(response, true);
        }

        function statusChangeCallback(response) {
            var now = new Date();
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                var expiresIn = new Date(response.authResponse.expiresIn * 1000);
                expiresIn.setTime(expiresIn.getTime() + now.getTime());
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token
                // and signed request each expire
                $scope.signupData.authData = $scope.debugData.authData = {
                    facebook: {
                        id: response.authResponse.userID,
                        access_token: response.authResponse.accessToken,
                        expiration_date: $filter('date')(expiresIn, "yyyy-MM-dd'T'HH:mm:ss.sss'Z'")
                    }
                };
                $scope.debugData.authData = angular.toJson($scope.debugData.authData, true)
                FB.api('/me', ["public_profile"]).then(
                    function (response) { fetchUserData(response) },
                    function (response) { alert(angular.toJson(response)) });
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
            }
        }

        $scope.connectWithFacebook = function () {
            if (!window.cordova) {
                alert("Test this feature on the emulator or on your device");
                return;
            }

            FB.login(["public_profile", "email"]).then(
                function (response) { statusChangeCallback(response) },
                function (response) { alert(angular.toJson(response)) });
        };
    }]);