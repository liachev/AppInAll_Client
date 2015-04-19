angular.module('updateSignup.controllers', [])

.controller('UpdateSignUpCtrl', ['$rootScope', '$http', 'ParseSDK', '$window', function($scope, $http, Parse, $window) {
    $scope.updateSignupData = {
        confirmPsw: ""
    };

    $http.get('translate/settings/strings.json').success(function (result) {
        console.info(angular.toJson(result, true));
        $scope.settingStrings = result;
    }).error(function (object, code) {
        console.warn(angular.toJson(object, true));
    });

    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.updateSignupData.userEmail = currentUser.get("email");
    } else {
        // TODO: go to login
    };

    $scope.getUser = function (userEmail) {
        var users = new (Parse.Collection.getClass("_User"));
        var user = users.loadUsersWithEmail(userEmail).then(function (results) {
            if (results.length == 1) {
                $scope.password = results[0].get("password");
            } else {
                $log.warn('[updateSignup.controllers] trying to get password "' + userEmail + '"');
            }
        });
    };

    $scope.updateSignup = function (updateSignupForm) {
        var currentUser = Parse.User.current();
        if (currentUser) {
            currentUser.set("email", $scope.updateSignupData.userEmail);
            currentUser.set("password", $scope.updateSignupData.userPsw);
        } else {
            // TODO: go to login
        }
        currentUser.save(null, {
            success: function (user) {
                $scope.reset(updateSignupForm); // user was saved
            }
        });
        $window.history.back()
    };

    $scope.reset = function (updateSignupForm) {
        if (updateSignupForm) {
            updateSignupForm.$setPristine();
            updateSignupForm.$setUntouched();
        }
        $scope.updateSignupData = {};
    };

}]);
