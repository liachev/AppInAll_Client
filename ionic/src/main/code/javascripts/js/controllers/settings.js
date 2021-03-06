angular.module('settings.controllers', [])

.controller('SettingsCtrl', ['$rootScope', '$state', 'ParseSDK', 'UserSettings', '$translate',
  function ($scope, $state, Parse, settings, $translate) {
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.userData = {
            userEmail: currentUser.get("email"),
            userPsw: "password" // fake password
        };
        currentUser.fetch().then(function (user) {
            console.info(angular.toJson(user, true));
            if (angular.isUndefined($scope.userData)) {
                $scope.userData = {};
            }
            $scope.userData.userEmail = user.get("email");
            var authData = user.get("authData");
            $scope.userData.isConnectedToFB = authData && authData.facebook;
        }, function (object, error) {
            console.info(angular.toJson(error, true));
            alert('An error occurs: ' + angular.toJson(error, true));
            // TODO: an error occurs - log it
        });
    } else {
        $state.go('app.signup');
    }

    $scope.saveButtonClick = function () {
        settings.saveSettings($scope.settingsData);
    };

    $scope.changeLanguage = function () {
        $translate.use($scope.settingsData.language);
    };
}]);