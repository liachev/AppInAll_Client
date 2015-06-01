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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin(); // TODO: complete login
    }, 1000);
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
    var currentUser = ParseSDK.User.current();
    return currentUser !== null;
  };
});
