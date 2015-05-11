angular.module('updateSignup.controllers', [])

    .controller('UpdateSignUpCtrl', ['$rootScope', '$http', 'ParseSDK', '$window', function ($scope, $http, Parse, $window) {
        var defaultData = $scope.updateSignupData = {};

        $scope.isValid = function () {
            return !isNullOrWhiteSpace($scope.updateSignupData.userEmail)
                || !isNullOrWhiteSpace($scope.updateSignupData.userPsw);
        };

        var currentUser = Parse.User.current();
        if (currentUser) {
            //$scope.updateSignupData.userEmail = currentUser.get("email");
        } else {
            // TODO: go to login
        }

        $scope.updateSignup = function (updateSignupForm) {
            var currentUser = Parse.User.current();
            if (currentUser) {
                var updateEmail = function (user) {
                    if (!isNullOrWhiteSpace($scope.updateSignupData.userEmail)) {
                        return user.save({
                            email: $scope.updateSignupData.userEmail
                        }, {
                            success: function (user) {
                                $scope.settingsData.userEmail = user.get("email");
                                return user;
                            },
                            error: function (error) {
                                // Show the error message somewhere
                                console.warn("Error: " + error.code + " " + error.message);
                                Parse.Promise.error(error);
                            }
                        })
                    } else {
                        return Parse.Promise.as(user);
                    }
                };
                var updatePassword = function (user) {
                    if (!isNullOrWhiteSpace($scope.updateSignupData.userPsw)) {
                        return user.save({
                            password: $scope.updateSignupData.userPsw
                        }, {
                            success: function (user) {
                                return user;
                            },
                            error: function (error) {
                                // Show the error message somewhere
                                console.warn("Error: " + error.code + " " + error.message);
                                Parse.Promise.error(error);
                            }
                        });
                    } else {
                        return Parse.Promise.as(user);
                    }
                };

                updateEmail(currentUser).then(function (user) {
                    updatePassword(user).then(function (user) {
                        $scope.reset(updateSignupForm); // user was saved
                    })
                });
                $window.history.back()
            } else {
                // TODO: go to login
            }
        };

        var isNullOrWhiteSpace = function (str) {
            return angular.isUndefined(str) || str == null || ((typeof str === "string") && str.trim() == "");
        };

        $scope.reset = function (updateSignupForm) {
            if (updateSignupForm) {
                updateSignupForm.$setPristine();
                updateSignupForm.$setUntouched();
            }
            $scope.updateSignupData = defaultData;
        };
    }]);
