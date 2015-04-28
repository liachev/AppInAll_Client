// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',

  /* controllers */
  'starter.controllers',

  /* models */
  'appinall.models.users',
  'appinall.models.agreements',

  /* services */
  'ParseServices',
  'LocalStorageModule'
])

.run(function($ionicPlatform, localStorageService) {
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

  // angular localStorageService 'isSupported' test
  if(localStorageService.isSupported) // FixMe: localStorageService doesn't work
  {
      logging.log("localStorageService is supported");
  }else{
      logging.log("localStorageService is NOT supported");
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

  .state('app.playlists', {
    url: "/playlists",
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
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
            var delay = $q.defer();
            $http.get('translate/signup/strings.json').success(function(result) {
              $scope.strings = result;
              delay.resolve();
            }).error(function(object, code) {
              delay.reject();
            });
            return delay.promise;
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
          delay: ['$q', '$http', '$rootScope', '$state', function ($q, $http, $scope, $state) {
            var delay = $q.defer();
            $http.get('translate/settings/strings.json').success(function (result) {
              $scope.strings = result;
              delay.resolve();
            }).error(function(object, code) {
              delay.reject();
            });
            return delay.promise;
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
            var delay = $q.defer();
            $http.get('translate/settings/strings.json').success(function(result) {
              $scope.strings = result;
              delay.resolve();
            }).error(function(object, code) {
              delay.reject();
            });
            return delay.promise;
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
            var delay = $q.defer();
            $http.get('translate/settings/strings.json').success(function(result) {
              $scope.strings = result;
              delay.resolve();
            }).error(function(object, code) {
              delay.reject();
            });
            return delay.promise;
          }]
        }
      }
    }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');

  if (window.cordova && (window.cordova.platformId == "browser")) { // TODO: should be removed later or resolve this
    var appId = prompt("Enter FB Application ID", "");
    $cordovaFacebookProvider.browserInit(appID);
  }
});
