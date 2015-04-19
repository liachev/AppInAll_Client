angular.module('settings.controllers', ['updateSignup.controllers', 'editPayment.controllers'])

.controller('SettingsCtrl', ['$scope', '$http', '$cordovaGlobalization', 'ParseSDK', function ($scope, $http, globalization, Parse) {
    $scope.settingsData = {};

    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.settingsData.userEmail = currentUser.get("email");
    };

    $http.get('translate/settings/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    $scope.languages = [];
    $http.get('json/language.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.languages[i] = {
                code: results[i].code,
                name: results[i].name
            }
        }
    }).error(function (data) {
        alert(data || 'error');
    })

    $scope.timezones = [];
    $http.get('json/timezones.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.timezones[i] = {
                abbr: results[i].abbr,
                text: results[i].text
            }
        }
    }).error(function (data) {
        alert(data || 'error');
    });

    $scope.currencys = [];
    $http.get('json/currency.json').success(function (results) {
        for (var i = 0; i < results.length; i++) {
            $scope.currencys[i] = {
                symbol: results[i].symbol,
                name: results[i].name,
                code: results[i].code
            }
        }
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
    }).error(function (data) {
        alert(data || 'error');
    });

    if (window.cordova) {

        globalization.getPreferredLanguage().then(
            function (language) {
                $scope.settingsData.language = 'en-US';
                alert(angular.toJson($scope.languages));
                for (i in $scope.languages) {
                    alert(angular.toJson($scope.languages[i]));
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

        globalization.getDatePattern().then(
            function (date) {
                $scope.settingsData.date = date.pattern;
                },
            function () {
                alert('Error getting format\n');
            }
        );

        globalization.getDatePattern().then(
            function (date) {
                $scope.settingsData.timezone = date.timezone;
            },
            function () {
                alert('Error getting pattern\n');
            }
        );
    }

}]);