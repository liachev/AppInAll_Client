angular.module('profile.controllers', [])

.controller('ProfileCtrl', ['$state', '$scope', '$http', '$stateParams', 'ParseSDK',
  function($state, $scope, $http, $stateParams, Parse) {
    $http.get('translate/profiles/strings.json').success(function(result) {
        $scope.strings = result;
    }).error(function(object, code) {
        console.warn(object);
    });

    var currentUser = Parse.User.current();
    if (currentUser) {
       // do stuff with the user
    } else {
       $scope.login(); // show the signup or login page
    }

    $scope.profileData = defaultData = {
      gender: 'N'
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $scope.tomorrow = tomorrow.toISOString().split("T")[0];

    var query = new Parse.Query(Parse.Object.getClass("Profile"));
    query.get($stateParams.profileId, {
      success: function (profile) {
        // The object was retrieved successfully.
        $scope.title = $scope.strings.title.add_profile;
        $scope.profileData = {
            id: profile.id,
            firstName: profile.get("firstName"),
            lastName: profile.get("lastName"),
            avatar: profile.get("avatar"),
            location: profile.get("location"),
            gender: profile.get("gender"),
            birthday: profile.get("birthday"),
            kid: profile.get("kid"),
            interestedIn: profile.get("interestedIn"),
            isSelected: profile.get("isSelected"),
            name: profile.get("firstName") + " " + profile.get("lastName")
        };
        $scope.title =
          $scope.strings.title.edit_profile + " '" + $scope.profileData.firstName + " " + $scope.profileData.lastName + "'";
      },
      error: function(object, error) {
        $scope.title = $scope.strings.title.add_profile;
        $scope.profileData = { };
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
      }
    });

    $scope.profileData.birthday && ($scope.profileData.birthday = new Date(result[i].birthday));

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

      var profile = profiles.addProfile($scope.profileData).then(function (profile) {
          var currentUser = Parse.User.current();
          if (currentUser) {
            var query = new Parse.Query(Parse.User);
            query.get(currentUser.id, {
              success: function(user) {
                // The object was retrieved successfully.
                profile.save({
                    user: user
                  }, {
                    success: function(profile) {
                      // The object was saved successfully.
                      $state.go('app.profiles');
                    },
                    error: function(profile, error) {
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
          }
      });
    };
  }]);