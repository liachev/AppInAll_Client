// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',

  /* controllers */ // TODO: add new controllers to 'ionic/src/main/code/javascripts/js/controllers.js'
  'starter.controllers',

  /* models */ // TODO: add new models to 'ionic/src/main/code/javascripts/js/modules/data/models.js'
  'appinall.models',

  /* services */
  'ParseServices'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
})

.config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
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
          delay: ['$q', '$rootScope', 'ParseSDK', function($q, $scope, Parse) {
            var delay = $q.defer();
            var currentUser = Parse.User.current();
            if (currentUser) {
               // do stuff with the user
              $scope.profiles = [];
              var profiles = new (Parse.Collection.getClass("Profile"));
              profiles.getProfilesByUser(currentUser).then(function (result) {
                console.info(angular.toJson(result));
                for (i in result) {
                  $scope.profiles[i] = {
                    id: result[i].id,
                    firstName: result[i].get("firstName"),
                    lastName: result[i].get("lastName"),
                    avatar: result[i].get("avatar"),
                    location: result[i].get("location"),
                    gender: result[i].get("gender"),
                    birthday: result[i].get("birthday"),
                    kid: result[i].get("kid"),
                    interestedIn: result[i].get("interestedIn"),
                    isSelected: result[i].get("isSelected"),
                    name: result[i].get("firstName") + " " + result[i].get("lastName")
                  };
                };
                var query = new Parse.Query(Parse.User);
                query.get(currentUser.id, {
                  success: function(user) {
                    // The object was retrieved successfully.
                    var selectedProfile = user.get("selectedProfile");
                    selectedProfile.fetch({
                      success: function(profile) {
                        $scope.selectedProfile = profile.id;
                      }
                    });
                  },
                  error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                  }
                }).then(function (user) {
                    delay.resolve();
                }, function (error) {
                    delay.resolve();
                });
              });
            } else {
              $scope.login(); // show the signup or login page
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
        controller: 'SignUpCtrl'
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

  .state('app.profile', {
    url: "/profiles/:profileId",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/signup');

  if (window.cordova && (window.cordova.platformId == "browser")) { // TODO: should be removed later or resolve this
    var appId = prompt("Enter FB Application ID", "");
    $cordovaFacebookProvider.browserInit(appID);
  }
});
