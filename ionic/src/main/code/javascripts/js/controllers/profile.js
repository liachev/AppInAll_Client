angular.module('profile.controllers', [])

.controller('ProfileCtrl', ['$state', '$scope', '$http', '$stateParams', 'ParseSDK',
  function($state, $scope, $http, $stateParams, Parse) {
    var currentUser = Parse.User.current();
    if (currentUser) {
       console.info(angular.toJson(currentUser)); // do stuff with the user
    } else {
       $scope.login(); // show the signup or login page
    }

    $scope.profileData = defaultData = {
      gender: 'N'
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $scope.tomorrow = tomorrow.toISOString().split("T")[0];

    $http.get('translate/profiles/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    $http.get('translate/profiles.json').success(function(result) { // TODO: delete this later
      $scope.title = $scope.strings.title.add_profile;
      for (i in result) {
        console.info(angular.toJson(result[i], true));
        if (angular.equals(result[i].id, $stateParams.profileId)) {
          $scope.profileData = result[i];
          $scope.title =
            $scope.strings.title.edit_profile + " '" + $scope.profileData.firstName + " " + $scope.profileData.lastName + "'";
          $scope.profileData.birthday && ($scope.profileData.birthday = new Date(result[i].birthday));
          break;
        }
      }
    }).error(function(object, code) {
        console.warn(object);
    });

    $scope.uploadPhoto = function () {
      alert('Not implemented yet') // TODO: complete uploading
    };

    $scope.editInterests = function () {
      alert('Not implemented yet') // TODO: complete editing
    };

    $scope.cancel = function () {
      $state.go('app.profiles');
      $scope.profileData = defaultData;
      $scope.currentDate = new Date().toISOString().split("T")[0];
    };

    $scope.save = function () {
      var profiles = new (Parse.Collection.getClass("Profile"));

      var profile = profiles.fetchProfileData($scope.profileData);
      var currentUser = Parse.User.current();
      if (currentUser) {
        var query = new Parse.Query(Parse.User);
        query.get(currentUser.id, {
          success: function(user) {
            alert(user);
            // The object was retrieved successfully.
            profile.save({
                user: user
              }, {
                success: function(user) {
                  // The object was saved successfully.
                },
                error: function(user, error) {
                  // The save failed.
                  // error is a Parse.Error with an error code and message.
                }
            });
          },
          error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
          }
        });
      } else {
         $scope.login(); // show the signup or login page
      }

      $state.go('app.profiles');
    };
  }]);