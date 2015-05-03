angular.module('profiles.controllers', ['profile.controllers'])

.controller('ProfilesCtrl', ['$scope', '$location', '$http', 'ParseSDK', function($scope, $location, $http, Parse) {
  $scope.data = { };

  $scope.selectItem = function ($index) {
    if (angular.equals($scope.selectedProfile, $scope.profiles[$index].id)) return;
    $scope.selectedProfile = $scope.profiles[$index].id;
    var currentUser = Parse.User.current();
    if (currentUser) {
      var query = new Parse.Query(Parse.User);
      query.get(currentUser.id, {
        success: function(user) {
          // The object was retrieved successfully.
          var queryToProfile = new Parse.Query(Parse.Object.getClass("Profile"));
          queryToProfile.get($scope.selectedProfile, {
            success: function(profile) {
              // The object was retrieved successfully.
              user.save({
                  selectedProfile: profile
                }, {
                  success: function(user) {
                    // The object was saved successfully.
                    console.info(angular.toJson(user));
                  },
                  error: function(user, error) {
                    // The save failed.
                    // error is a Parse.Error with an error code and message.
                  }
              });
            },
            error: function (object, error) {
              // The object was not retrieved successfully.
              // error is a Parse.Error with an error code and message.
            }
          });
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
    }
  };

  $scope.isSelected = function ($index) {
    return angular.equals($scope.profiles[$index].id, $scope.selectedProfile)
  };

  $scope.editItem = function(item) {
    $location.path("/app/profiles/" + (item && item.id || "new")) // if-then-else
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.profiles.splice(fromIndex, 1);
    $scope.profiles.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
    $scope.profiles.splice($scope.profiles.indexOf(item), 1)
    // TODO: remove profile from server
  };

  $scope.calcYears = function (item) {
    if (!item.birthday) { return }
    console.info(angular.toJson(item, true));
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
    angular.forEach(item.interestedIn, function(value, key) {
      result += (key > 0 ? ", " : "") + value
    });
    return result;
  }
}]);