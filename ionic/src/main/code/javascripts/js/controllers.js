angular.module('starter.controllers', ['signup.controllers', 'agreements.controllers'])

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
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProfilesCtrl', function($scope, $location) { // FixMe: move this to ionic/src/main/code/javascripts/js/controllers
  $scope.data = {
    selected: 0
  };

  $scope.profiles = [
    {
      firstName: 'Susan',
      lastName: 'Miller',
      gender: 'Female',
      birthday: new Date(1987, 1, 1),
      location: 'Raynham, MA',
      isOnline: true,
      interestedIn: ['Bicycle', 'Hiking']
    },
    {
      firstName: 'John',
      lastName: 'Miller',
      gender: 'Male',
      birthday: new Date(2011, 1, 1),
      location: 'Raynham, MA',
      isOnline: false,
      interestedIn: ['Swimming']
    },
    {
      firstName: 'Someone',
      lastName: 'Else',
      gender: '',
      birthday: null,
      location: 'Raynham, MA',
      isOnline: false,
      interestedIn: []
    }
  ];

  $scope.selectItem = function ($index) {
    $scope.profiles[$scope.data.selected].isSelected = false;
    $scope.profiles[$index].isSelected = true;
    $scope.data.selected = $index;
  };

  $scope.isSelected = function ($index) {
    return angular.equals($index, $scope.data.selected)
  };

  $scope.editItem = function(item) {
    $location.path("/app/profiles/" + (item && item.name || "new")) // if-then-else
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.profiles.splice(fromIndex, 1);
    $scope.profiles.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
    $scope.profiles.splice($scope.profiles.indexOf(item), 1)
  };

  $scope.calcYears = function (item) {
    if (!item.birthday) { return }

    var todayDate = new Date();
    var todayYear = todayDate.getFullYear();
    var todayMonth = todayDate.getMonth();
    var todayDay = todayDate.getDate();
    var age = todayYear - item.birthday.getFullYear();

    if (todayMonth < item.birthday.getMonth() - 1)
    {
      age--;
    }

    if (item.birthday.getMonth() - 1 == todayMonth && todayDay < item.birthday.getDate())
    {
      age--;
    }

    return age;
  };

  $scope.getInterests = function (item) {
    var result = "";
    angular.forEach(item.interestIn, function(value, key) {
      result += (key > 0 ? ", " : "") + value
    });
    return result;
  }
})

.controller('ProfileCtrl', function($scope, $http, $stateParams) { // FixMe: move this to ionic/src/main/code/javascripts/js/controllers
  $scope.profileData = {};

  $http.get('translate/signup/strings.json').success(function(result) {
      $scope.strings = result;
  }).error(function(object, code) {
      console.warn(object);
  });

  $scope.uploadPhoto = function () {
    alert('Not implemented yet')
  };

  $scope.interestedIn = function () {
    alert('Not implemented yet')
  };

  $scope.cancel = function () {
    alert('Not implemented yet')
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

