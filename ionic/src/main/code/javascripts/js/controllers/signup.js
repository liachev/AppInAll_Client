angular.module('signup.controllers', [])

.controller('SignUpCtrl', ['$rootScope', '$http', '$cordovaFacebook', 'ParseSDK', function($scope, $http, FB, Parse) {
    $scope.signupData = $scope.debugData = {}; // TODO: delete debugData after Connect with Facebook tested

    $http.get('translate/signup/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    $scope.signUp = function (signupForm) {
        var users = new (Parse.Collection.getClass("_User")); // TODO: must be changed later

        var user = users.fetchUserData($scope.signupData);

        user.signUp(null, {
            success: function(user) {
                if (angular.equals(user.getEmail(), $scope.signupData.email)) {
                    $scope.reset(signupForm);
                    alert("Congratulation! You are successfully registered");
                    // Hooray! Let them use the app now.
                } else {
                    alert("You already have an account!");
                }
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert(angular.toJson(error, true));
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

    function fetchUserData(response) {
        if (response && !response.error) {
            $scope.debugData.name = response.name;
            $scope.signupData.firstName = $scope.signupData.firstName || response.first_name || "";
            $scope.signupData.lastName = $scope.signupData.lastName || response.last_name || "";
            $scope.signupData.name = $scope.signupData.name || response.name || "";
            $scope.signupData.email = $scope.signupData.email || response.email || "";
            // TODO: complete this if new columns added to `User`
        }
        $scope.debugData.userInfo = angular.toJson(response, true);
    }

    function statusChangeCallback(response) {
        var now = new Date();
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response && (response.status === 'connected')) {
            var expiresIn = new Date(response.authResponse.expiresIn * 1000);
            expiresIn.setTime(expiresIn.getTime() + now.getTime());
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            $scope.signupData.authData = {
                facebook: {
                    id: response.authResponse.userID,
                    access_token: response.authResponse.accessToken,
                    expiration_date: expiresIn.toJSON()
                }
            };
            $scope.debugData.authData = angular.toJson($scope.signupData.authData, true)
            FB.api('/me', ["public_profile", "email"]).then(
                function success(response) { fetchUserData(response) },
                function failed(response) { alert(angular.toJson(response)) });
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

        function fbLogin() {
            FB.login(["public_profile", "email"]).then(
                function success(response) { statusChangeCallback(response) },
                function failed(response) { alert(angular.toJson(response)) });
        }

        FB.getLoginStatus().then(function success(response) {
            if (response && (response.status === 'connected')) {
                statusChangeCallback(response);
            }
            else {
                fbLogin();
            }
        }, function failed(response) {
            alert(angular.toJson(response));
            fbLogin();
        });
    };

    $scope.agreedCheckBox = function(){
        if (($scope.signupData.termsOfUseAgree && $scope.signupData.privacyPolicyAgree) !== true){
            $scope.signupData.isAgree = false;
            alert("You must agree with all of terms")
        }
    };
}]);