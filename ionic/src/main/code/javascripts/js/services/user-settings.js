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
                    if (window.cordova) {
                        globalization.getPreferredLanguage().then(
                            function (language) {
                                var selectedLanguage = defaultLang;
                                for (i in languages) {
                                    if (language.value.replace('-', '_') === languages[i].code) {
                                        selectedLanguage = languages[i].code;
                                        break;
                                    }
                                }
                                defer.resolve({selectedLanguage: selectedLanguage, languages: languages});
                            },
                            function () {
                                alert('Error getting language\n');
                                defer.reject("Error getting language");
                            }
                        );
                    } else {
                        defer.resolve({selectedLanguage: defaultLang, languages: languages});
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
                    defer.resolve({currency: currencies[0].code, currencies: currencies});
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
                    defer.resolve({date: formats[0].code, formats: formats});
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
                    defer.resolve({timezone: timezone, timezones: timezones});
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

                    var requests = [];
                    var langRequest = $q.defer();
                    requests.push(langRequest);
                    getLanguages().then(function (data) {
                        userSettingData.language = data.selectedLanguage;
                        userSettingData.languages = data.languages;
                    }, function (error) {
                        // TODO: an error occurs - log it
                        console.warn(angular.toJson(error, true));
                    }).then(function () {
                        langRequest.resolve(userSettingData);
                    });

                    var curRequest = $q.defer();
                    requests.push(curRequest);
                    getCurrencies().then(function (data) {
                        userSettingData.currency = data.currency;
                        userSettingData.currencies = data.currencies;
                    }, function (error) {
                        // TODO: an error occurs - log it
                        console.warn(angular.toJson(error, true));
                    }).then(function () {
                        curRequest.resolve(userSettingData);
                    });

                    var dateRequest = $q.defer();
                    requests.push(dateRequest);
                    getFormats().then(function (data) {
                        userSettingData.date = data.date;
                        userSettingData.formats = data.formats;
                    }, function (error) {
                        // TODO: an error occurs - log it
                        console.warn(angular.toJson(error, true));
                    }).then(function () {
                        dateRequest.resolve(userSettingData);
                    });

                    var tzRequest = $q.defer();
                    requests.push(tzRequest);
                    getTimezone().then(function (data) {
                        userSettingData.timezone = data.timezone;
                        userSettingData.timezones = data.timezones;
                    }, function (error) {
                        // TODO: an error occurs - log it
                        console.warn(angular.toJson(error, true));
                    }).then(function () {
                        tzRequest.resolve(userSettingData);
                    });

                    $q.all(requests).then(function (values) {
                        var data = values[values.length - 1];
                        data.promise.then(function (settings) {
                            defer.resolve(settings);
                        });
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

                // TODO: move data from 'settings' to 'userSettingData'
                //var dataToSave = {
                //    timeZone: settings.timezone || userSettingData.timezone,
                //    dateFormat: settings.date || userSettingData.date,
                //    language: settings.language || userSettingData.language,
                //    distance: settings.distance || userSettingData.distance,
                //    timeFormat: settings.timeformat || userSettingData.timeformat,
                //    currency: settings.currency || userSettingData.currency
                //};

                defer.promise.then(function (data) {
                    if (localStorageService.isSupported) {
                        localStorageService.set("settings", data);
                    }
                    else if (localStorageService.cookie.isSupported) {
                        localStorageService.cookie.set("settings", data);
                    }
                });
            };

            return {
                getSettings: getSettings,
                saveSettings: saveSettings
            }
        }]);