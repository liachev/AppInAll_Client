angular.module('usersettings.services', [])

.factory('UserSettings', ['localStorageService', '$cordovaGlobalization', '$http', '$q',
    function (localStorageService, globalization, $http, $q) {
        var userSettingData = {
            distance: "miles",
            timeformat: "military"
        };
        var defaultSettings = userSettingData;

        var getLanguages = function () {
            var defer = $q.defer();
            $http.get('json/language.json').success(function (results) {
                var languages = [];
                for (var i = 0; i < results.length; i++) {
                    languages[i] = {
                        code: results[i].code,
                        name: results[i].name
                    }
                }
                var defaultLang = 'en_US';
                if (window.cordova && globalization) {
                    globalization.getPreferredLanguage().then(
                        function (language) {
                            var selectedLanguage = defaultLang;
                            for (i in languages) {
                                if (language.value.replace('-', '_') === languages[i].code) {
                                    selectedLanguage = languages[i].code;
                                    break;
                                }
                            }
                            defer.resolve({selected: {key: "language", value: selectedLanguage},
                                           options: {key: "languages", value: languages}});
                        },
                        function () {
                            alert('Error getting language\n');
                            defer.reject("Error getting language");
                        }
                    );
                } else {
                    defer.resolve({selected: {key: "language", value: defaultLang},
                                   options: {key: "languages", value: languages}});
                }
            }).error(function (data) {
                alert(data || 'error');
                defer.reject(data);
            });
            return defer.promise;
        };

        var getCurrencies = function () {
            var defer = $q.defer();
            $http.get('json/currency.json').success(function (results) {
                var currencies = [];
                for (var i = 0; i < results.length; i++) {
                    currencies[i] = {
                        symbol: results[i].symbol,
                        name: results[i].name,
                        code: results[i].code,
                        symbol_native: results[i].symbol_native
                    }
                }
                defer.resolve({selected: {key: "currency", value: currencies[0].code},
                               options: {key: "currencies", value: currencies}});
            }).error(function (data) {
                alert(data || 'error');
                defer.reject(data);
            });
            return defer.promise;
        };

        var getFormats = function () {
            var defer = $q.defer();
            $http.get('json/format.json').success(function (results) {
                var formats = [];
                for (var i = 0; i < results.length; i++) {
                    formats[i] = {
                        code: results[i].code,
                        name: results[i].name
                    }
                }
                defer.resolve({selected: {key: "date", value: formats[0].code},
                               options: {key: "formats", value: formats}});
            }).error(function (data) {
                alert(data || 'error');
                defer.reject(data);
            });
            return defer.promise;
        };

        var getTimezone = function () {
            var defer = $q.defer();

            var today = function () {
                return new Date(); // maybe needs in UTC time
            };

            var todayStr = (today() || new Date()).toString();
            var index = todayStr.indexOf('(') + 1;
            var utcTZ = todayStr.substr(index, todayStr.length - index - 1);
            var regex = new RegExp("GMT[+|-][0-9]{4}");
            var gmtTZ = regex.exec(todayStr);
            var currentTZ = [utcTZ, gmtTZ && gmtTZ[0]];

            $http.get('json/timezones.json').success(function (results) {
                var timezones = [];
                var timezone = results[0] && results[0].abbr;
                for (var i = 0; i < results.length; i++) {
                    timezones[i] = {
                        abbr: results[i].abbr,
                        name: results[i].name,
                        offset: results[i].offset
                    };
                    if ((currentTZ.indexOf(results[i].abbr) > -1)) {
                        timezone = results[i].abbr;
                    } else {
                    }
                }
                defer.resolve({selected: {key: "timezone", value: timezone},
                               options: {key: "timezones", value: timezones}});
            }).error(function (data) {
                alert(data || 'error');
                defer.reject(data);
            });
            return defer.promise;
        };

        var init = function () {
            var defer = $q.defer();
            userSettingData = localStorageService.get("settings");
            if (userSettingData === null) {
                userSettingData = defaultSettings;

                var requests = [getLanguages(), getCurrencies(), getFormats(), getTimezone()];
                $q.all(requests).then(function (result) {
                    angular.forEach(result, function(response) {
                        userSettingData[response.selected.key] = response.selected.value;
                        userSettingData[response.options.key] = response.options.value;
                    });
                    defer.resolve(userSettingData);
                });
            } else {
                defer.resolve(userSettingData);
            }
            return defer.promise;
        };

        var getSettings = function () {
            var defer = $q.defer();
            init().then(function (data) {
                defer.resolve(data);
            }, function (error) {
                // TODO: an error occurs - log it
                defer.resolve(userSettingData);
            });
            return defer.promise;
        };

        var saveSettings = function (settings) {
            var defer = $q.defer();
            if (angular.isUndefined(settings) || settings === null || settings === {}) {
                getSettings().then(function (data) {
                    defer.resolve(data);
                }, function (error) {
                    // TODO: an error occurs - log it
                    defer.resolve(defaultSettings);
                });
            } else {
                defer.resolve(settings);
            }

            defer.promise.then(function (data) {
                if (localStorageService.isSupported) {
                    localStorageService.set("settings", data);
                }
                else if (localStorageService.cookie.isSupported) {
                    localStorageService.cookie.set("settings", data);
                }
            });

            return defer.promise;
        };

        return {
            getSettings: getSettings,
            saveSettings: saveSettings
        }
    }]);