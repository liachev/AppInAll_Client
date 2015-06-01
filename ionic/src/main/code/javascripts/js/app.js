// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',
  'ngMaterial',
  'ngMdIcons',
  'tabSlideBox',

  /* controllers */ // TODO: add new controllers to 'ionic/src/main/code/javascripts/js/controllers.js'
  'starter.controllers',

  /* models */ // TODO: add new models to 'ionic/src/main/code/javascripts/js/modules/data/models.js'
  'appinall.models',

  /* services */ // TODO: add new services to 'ionic/src/main/code/javascripts/js/services/services.js'
  'appinall.services'
])

.run(function ($ionicPlatform, localStorageService, calendarService, UserSettings) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
    // Parse initialization for logging to parse.com
    // FixMe: duplicated with ionic/src/main/code/javascripts/js/services/parse-service.js:6
    Parse.initialize("O7eCGvKWO5BihNXJQv8zU0Ewd9a5nLJs0EBZWFjr", "Aohwuhy4j63Rs9tL4kXuc4lD8zGqv6wgrI74yXnU");

    // angular localStorageService 'isSupported' test
    if (localStorageService.isSupported) {
        logging.log("localStorageService is supported");
    } else {
        logging.log("localStorageService is NOT supported");
    }

    var firstStart = true; // TODO: detect first app start
    if (firstStart || localStorageService.get("settings") === null) {
      UserSettings.saveSettings(null); // get default settings
    }
})

.config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })

  .state('app.profiles', {
    url: "/profiles",
    views: {
      'menuContent': {
        templateUrl: "templates/profiles.html",
        controller: 'ProfilesCtrl',
        resolve: {
          delay: ['$q', '$rootScope', '$state', 'ParseSDK', function($q, $scope, $state, Parse) {
            var delay = $q.defer();
            var currentUser = Parse.User.current();
            if (currentUser) {
               // do stuff with the user
              $scope.profiles = [];
              var profiles = new (Parse.Collection.getClass("Profile"));
              profiles.getProfilesByUser(currentUser).then(function (result) {
                for (i in result) {
                  $scope.profiles[i] = {
                    id: result[i].id,
                    firstName: result[i].get("firstName"),
                    lastName: result[i].get("lastName"),
                    avatar: result[i].get("avatar"),
                    avatarSrc: (result[i].get("avatar") && result[i].get("avatar").url()) || "img/ionic.png",
                    location: result[i].get("location"),
                    gender: result[i].get("gender"),
                    birthday: result[i].get("birthday"),
                    kid: result[i].get("kid"),
                    interestedIn: result[i].get("interestedIn"),
                    name: result[i].get("firstName") + " " + result[i].get("lastName")
                  };
                };
                var query = new Parse.Query(Parse.User);
                query.get(currentUser.id, {
                  success: function(user) {
                    // The object was retrieved successfully.
                    var selectedProfile = user.get("selectedProfile");
                    selectedProfile && selectedProfile.fetch({
                      success: function(profile) {
                        $scope.selectedProfile = selectedProfile.id;
                      }
                    });
                  },
                  error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    alert('current user getting error: ' + angular.toJson(error, true));
                    delay.reject(error);
                  }
                }).then(function (user) {
                    delay.resolve();
                }, function (error) {
                    delay.reject(error);
                });
              });
            } else {
              $state.go('app.signup'); // show the signup or login page
              delay.resolve();
            }
            return delay.promise;
          }]
        }
      }
    }
  })

  .state('app.signup', {
    url: "/signup",
    views: {
      'menuContent': {
        templateUrl: "templates/signup.html",
        controller: 'SignUpCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'signup');
          }]
        }
      }
    }
  })

  .state('app.messages', {
    url: "/messages",
    views: {
      'menuContent': {
        templateUrl: "templates/messages.html",
        controller: 'MessagesCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'messages');
          }]
        }
      }
    }
  })

  .state('app.chat', {
    url: "/chat/:profileId",
    views: {
      'menuContent': {
        templateUrl: "templates/chat.html",
        controller: 'MessagesCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'messages');
          }]
        }
      }
    }
  })

  .state('app.agreement', {
    url: "/agreement",
    views: {
      'menuContent': {
        templateUrl: "templates/agreement.html",
        controller: 'AgreementsCtrl'
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl',
        requireLogin: true,
        resolve: {
          delay: ['$q', '$http', '$rootScope', 'UserSettings', function ($q, $http, $scope, settings) {
            settings.getSettings().then(function (data) {
              $scope.settingsData = data;
            });
            return loadTranslation($q, $http, $scope, 'settings');
          }]
        }
      }
    }
  })

  .state('app.update_signup', {
    url: "/update_signup",
    views: {
      'menuContent': {
        templateUrl: "templates/update_signup.html",
        controller: 'UpdateSignUpCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'settings');
          }]
        }
      }
    }
  })

  .state('app.edit_payment', {
    url: "/edit_payment",
    views: {
      'menuContent': {
        templateUrl: "templates/edit_payment.html",
        controller: 'EditPaymentCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'settings');
          }]
        }
      }
    }
  })

  .state('app.profile', {
    url: "/profiles/:profileId",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl',
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'profiles');
          }]
        }
      }
    }
  })

  .state('app.eventByDate', {
    url: "/eventdate",
    views: {
      'menuContent': {
        templateUrl: "templates/eventsByDate.html",
        controller: 'EventsCtrl'
      }
    }
  })


  .state('app.createEvent', {
    url: "/createEvent",
    views: {
      'menuContent': {
        templateUrl: "templates/createEvent.html",
        controller: 'CreateEventCtrl',
        requireLogin: true,
        resolve: {
          delay: ['$q', '$http', '$rootScope', function ($q, $http, $scope) {
            return loadTranslation($q, $http, $scope, 'createEvent');
          }]
        }
      }
    }
  })

  .state('app.events', {
      url: "/events/:category",
      views: {
          'menuContent': {
              templateUrl: "templates/events.html",
              controller: 'EventsCtrl'
          }
      }
  })

  .state('app.eventCategories', {
      url: "/categories",
      views: {
          'menuContent': {
              templateUrl: "templates/eventCategories.html",
              controller: 'CategoriesCtrl'
          }
      }
  })
      .state('app.eventsOnMap', {
          url: "/eventsonmap",
          views: {
              'menuContent': {
                  templateUrl: "templates/eventsOnMap.html",
                  controller: 'eventsOnMapCtrl'
              }
          }
      })
  .state('app.tree-view-array', {
    url: "/tree-view-array-example",
    views: {
      'menuContent': {
        templateUrl: "templates/ui-tree.html",
        controller: 'UITreeCtrl',
        resolve: {
          data: ['$q', '$http', 'DataSource', function ($q, $http, source) {
            var deferred = $q.defer();
            $http.get('json/data-source-sample.json').success(function (response) {
                source.fromArray(response).then(function (data) {
                    console.debug(data);
                    deferred.resolve(data);
                }, function (error) {
                    console.warn(error);
                    deferred.reject(error);
                });
            }).error(function (object, code) {
                console.warn(object);
                deferred.reject(object);
            });
            return deferred.promise;
          }],
          tableName: [function () {
           return "";
          }]
        }
      }
    }
  })

  .state('app.tree-view-table', {
    url: "/tree-view-table-example",
    views: {
      'menuContent': {
        templateUrl: "templates/ui-tree.html",
        controller: 'UITreeCtrl',
        resolve: {
          data: ['$q', 'DataSource', 'tableName', function ($q, source, tableName) {
            var deferred = $q.defer();
            source.setTitleColumnName("name");
            source.setParentColumnName("parentId");
            source.setMaxDepth(1);
            source.fromDbTable(tableName, null).then(function (data) {
                console.debug(data);
                deferred.resolve(data);
            }, function (error) {
                console.warn(error);
                deferred.reject(error);
            });
            return deferred.promise;
          }],
          tableName: [function () {
            return "Category";
          }]
        }
      }
    }
  })

  .state('app.list-view-table', {
    url: "/list-view-table-example",
    views: {
      'menuContent': {
        templateUrl: "templates/ui-tree.html",
        controller: 'UITreeCtrl',
        resolve: {
          data: ['$q', 'DataSource', 'tableName', function ($q, source, tableName) {
            var deferred = $q.defer();
            source.setTitleColumnName("name");
            source.setParentColumnName(null);
            source.setMaxDepth(1);
            source.fromDbTable(tableName, null).then(function (data) {
                console.debug(data);
                deferred.resolve(data);
            }, function (error) {
                console.warn(error);
                deferred.reject(error);
            });
            return deferred.promise;
          }],
          tableName: [function () {
            return "Category";
          }]
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

  var loadTranslation = function (q, http, scope, dir) {
    var delay = q.defer();
    http.get('translate/' + dir + '/strings.json').success(function(result) {
      scope.strings = result;
      delay.resolve();
    }).error(function(object, code) {
      console.warn(object);
      delay.reject(object);
    });
    return delay.promise;
  };

  if (window.cordova && (window.cordova.platformId == "browser")) { // TODO: should be removed later or resolve this
    var appId = prompt("Enter FB Application ID", "");
    $cordovaFacebookProvider.browserInit(appID);
  }
});
