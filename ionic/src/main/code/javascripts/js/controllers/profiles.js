angular.module('profiles.controllers', ['profile.controllers'])

.controller('ProfilesCtrl', function($scope, $location) {
  $scope.data = {
    selected: 0 // TODO: instantiate selected profile
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
});