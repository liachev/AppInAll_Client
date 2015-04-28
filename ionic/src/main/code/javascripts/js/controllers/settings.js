angular.module('settings.controllers', [])

.controller('SettingsCtrl', ['$rootScope', '$http', '$cordovaGlobalization', '$state', 'ParseSDK', 'localStorageService',
  function ($scope, $http, globalization, $state, Parse, localStorageService) {
    var defaultData = $scope.settingsData = {
        distance: "miles",
        timeformat: "military"
    };

    $scope.today = function () {
        return new Date();
    };

    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.settingsData.userEmail = currentUser.get("email");
        $scope.settingsData.userPsw = "password"; // fake password
        currentUser.fetch().then(function (user) {
            console.info(angular.toJson(user, true));
            if (angular.isUndefined($scope.settingsData)) {
                $scope.settingsData = defaultData;
            }
            $scope.settingsData.userEmail = user.get("email");
            var authData = user.get("authData");
            $scope.settingsData.isConnectedToFB = authData && authData.facebook;
        }, function (object, error) {
            console.info(angular.toJson(error, true));
            alert('An error occurs: ' + angular.toJson(error, true));
            // TODO: an error occurs - log it
        });
    } else {
        $state.go('app.signup');
    }

    $scope.languages = [];
    $http.get('json/language.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.languages[i] = {
                code: results[i].code,
                name: results[i].name
            }
        };
    if (window.cordova) {
        globalization.getPreferredLanguage().then(
            function (language) {
                $scope.settingsData.language = 'en-US';
                for (i in $scope.languages) {
                    if (language.value === $scope.languages[i].code) {
                        $scope.settingsData.language = $scope.languages[i].code;
                        break;
                    }
                }
            },
            function () {
                alert('Error getting language\n');
            }
        );
    }
    }).error(function (data) {
        alert(data || 'error');
    });

    $scope.isCurrentTZ = function (tz) {
        return (currentTZ.indexOf(tz) > -1);
    };

    var todayStr = ($scope.today() || new Date()).toString();
    var index = todayStr.indexOf('(') + 1;
    var utcTZ = todayStr.substr(index, todayStr.length - index - 1);
    var regex = new RegExp("GMT[+|-][0-9]{4}");
    var gmtTZ = regex.exec(todayStr);
    var currentTZ = [utcTZ, gmtTZ && gmtTZ[0]];

    $scope.timezones = [];
    $http.get('json/timezones.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.timezones[i] = {
                abbr: results[i].abbr,
                name: results[i].name,
                offset: results[i].offset
            };
            if ($scope.isCurrentTZ(results[i].abbr)) {
                $scope.settingsData.timezone = results[i].abbr;
            } else {
            }
        }
    }).error(function (data) {
        alert(data || 'error');
    });

    $scope.currencies = [];
    $http.get('json/currency.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.currencies[i] = {
                symbol: results[i].symbol,
                name: results[i].name,
                code: results[i].code,
                symbol_native: results[i].symbol_native
            }
        }
    $scope.settingsData.currency = $scope.currencies[0].name;
    }).error(function (data) {
        alert(data || 'error');
    });

    $scope.formats = [];
    $http.get('json/format.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.formats[i] = {
                code: results[i].code,
                name: results[i].name
            }
        }
    $scope.settingsData.date = $scope.formats[0].code;
    }).error(function (data) {
        alert(data || 'error');
    });

    $scope.saveButtonClick = function(){
        if(localStorageService.isSupported) {
            localStorageService.set("settings", $scope.settingsData);
        }
        else if(localStorageService.cookie.isSupported) {
            localStorageService.cookie.set("settings", $scope.settingsData);
        }
    };
}]);