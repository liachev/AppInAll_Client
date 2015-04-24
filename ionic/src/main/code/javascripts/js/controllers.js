angular.module('starter.controllers', 
    ['signup.controllers',
      'agreements.controllers',
      'events.controllers',
      'eventCategories.controllers',
    'profiles.controllers'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
})

.controller('welcomePageCtrl', function($scope) { // FixMe: move this to ionic/src/main/code/javascripts/js/controllers
  $scope.bWelcomePage = Boolean(true); // #debugAA welcome
})

.directive('welcomePage', function () { // FixMe: move this to ionic/src/main/code/javascripts/js/modules/directives
  return {
    restrict: 'E',
    templateUrl: 'templates/welcome.html',
    controller: function($scope,$window, $http){
      $scope.welcomePage_activeSlide = 0;

      var icSizeList = [512, 144, 96, 48];
      $scope.welcomePage_iconSize = icSizeList[icSizeList.length-1];

      $http.get('translate/welcomePage.json').success(function(data) {
        for(var i = 0; i < data.length; i++)
          data[i].description = data[i].description.replace(/(\r\n|\r|\n)/g, '\n');
        console.log(data);
        $scope.welcomePage_data = data;
      });

      $scope.$watch(function(){
        return $window.innerWidth;
      }, function(value) {
        console.log(value); // #debugAA welcome
        for (var i = 0; i < icSizeList.length; i++) {
          if ($window.innerWidth >= icSizeList[i] + 64) {
            $scope.welcomePage_iconSize = icSizeList[i];
            break;
          }
        }
      });
    },
    controllerAs: "welcomeCtrl"
  };
});