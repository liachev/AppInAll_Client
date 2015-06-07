angular.module('starter.controllers',
    ['signup.controllers',
      'agreements.controllers',
      'events.controllers',
      'eventCategories.controllers',
      'profiles.controllers',
      'messages.controllers',
      'home.controllers',
      'settings.controllers',
      'editPayment.controllers',
      'updateSignup.controllers',
      'ui-tree.controllers',
      'createEvent.controllers', 
      'mapBox.controllers',
      'welcomePage.controllers'
    ])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicSideMenuDelegate, $ionicActionSheet, ParseSDK) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    ParseSDK.User.logIn($scope.loginData.email, $scope.loginData.password, {
        success: function(user) {
            $scope.closeLogin();
            if ($state.is('app.home')) {
                $state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams
            } else {
                $state.go('app.home');
            }
        },
        error: function(user, error) {
            alert(angular.toJson(error, true));
        }
    });
  };

  // Triggered on a button click, or some other target
  $scope.showActionSheet = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b>Please Sign Up First</b>' }
      ],
      cancelText: 'Cancel',
      cancel: function() {
           // add cancel code..
           hideSheet();
         },
      buttonClicked: function(index) {
        $state.go('app.signup');
        return true;
      }
    });

    // For example's sake, hide the sheet after one minute
    $timeout(function() {
      hideSheet();
    }, 60000);
  };

  $scope.menuToggle = function (side) {
    if (!($ionicSideMenuDelegate.isOpen() || $scope.shouldLeftSideMenuBeEnabled())) {
      $scope.showActionSheet();
    } else if (side === 'left') {
      $ionicSideMenuDelegate.toggleLeft();
    } else if (side === 'right'){
      $ionicSideMenuDelegate.toggleRight();
    }
  };

  $scope.shouldLeftSideMenuBeEnabled = function () {
    return ParseSDK.User.current() !== null;
  };

  var currentUser = ParseSDK.User.current();
  !currentUser || currentUser.fetch({
    success: function (user) {
        user.get("selectedProfile").fetch({
            success: function (profile) {
                !$scope.menuData && ($scope.menuData = {});
                $scope.menuData.username = profile.getFirstName() || '';
            }
        });
    }
  });

  // TODO: complete menu data forming
  $scope.menuData = {
    username: '',
    profilesCount: 0,
    unreadMessages: 0,
    friendsCount: 0,
    newsCount: 0,
    forumCount: 0
  };
});