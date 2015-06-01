angular.module('signup.controllers', [])

.controller('SignUpCtrl', ['$rootScope', '$http', '$window', '$cordovaFacebook', 'ParseSDK',
 function($scope, $http, $window, FB, Parse) {
    $scope.signupData = $scope.debugData = {}; // TODO: delete debugData after Connect with Facebook tested

    $scope.signUp = function (signupForm) {
        var users = new (Parse.Collection.getClass("_User")); // TODO: must be changed later

        var user = users.fetchUserData($scope.signupData);

        user.signUp(null, {
            success: function(user) {
                if (angular.equals(user.getEmail(), $scope.signupData.email)) {
                    $scope.reset(signupForm);
                    alert("Congratulation! You are successfully registered");
                    // Hooray! Let them use the app now.
                    var defaultProfile = {
                        firstName: user.getFirstName(),
                        lastName: user.getLastName(),
                        avatar: null,
                        location: null,
                        gender: 'N',
                        birthday: null,
                        kid: false,
                        interestedIn: []
                    };
                    var profiles = new (Parse.Collection.getClass("Profile"));
                    profiles.addProfile(defaultProfile).then(function (profile) {
                      Parse.User.current().fetch({
                        success: function (user) {
                            // The object was retrieved successfully.
                            profile.save({
                                user: user
                              }, {
                                success: function (profile) {
                                  // The object was saved successfully.
                                  user.save({
                                      selectedProfile: profile
                                    }, {
                                      success: function(user) {
                                        // The object was saved successfully.
                                        console.info(angular.toJson(user));
                                      },
                                      error: function(user, error) {
                                        // The save failed.
                                        // error is a Parse.Error with an error code and message.
                                      }
                                  });
                                },
                                error: function (profile, error) {
                                  // The save failed.
                                  // error is a Parse.Error with an error code and message.
                                  $scope.debugInfo = 'profile saving error: ' + angular.toJson(error, true);
                                }
                            });
                        },
                        error: function (object, error) {
                          // The object was not retrieved successfully.
                          // error is a Parse.Error with an error code and message.
                          $scope.debugInfo = 'user getting error: ' + angular.toJson(error, true);
                        }
                      });
                    }, function (error) {
                      $scope.debugInfo = 'profile getting error: ' + angular.toJson(error, true);
                    });
                    // TODO: create default user profile here
                    $window.history.back();
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