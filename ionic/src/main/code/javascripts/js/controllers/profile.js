angular.module('profile.controllers', [])

.controller('ProfileCtrl', ['$state', '$scope', '$stateParams', '$filter', 'ParseSDK',
  function($state, $scope, $stateParams, $filter, Parse) {
    var currentUser = Parse.User.current();
    if (currentUser) {
       // do stuff with the user
    } else {
      $state.go('app.signup'); // show the signup or login page
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
        $scope.profileData = {
            id: profile.id,
            firstName: profile.get("firstName"),
            lastName: profile.get("lastName"),
            avatar: profile.get("avatar"),
            avatarSrc: (profile.get("avatar") && profile.get("avatar").url()) || "img/ionic.png",
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
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        $scope.title = $scope.strings.title.add_profile;
        $scope.profileData = defaultData;
        $scope.debugInfo = 'profile getting error: ' + angular.toJson(error, true);
      }
    });

    $scope.profileData.birthday && ($scope.profileData.birthday = new Date(result[i].birthday));

    $scope.fileProgress = "No Photo";

    $scope.$on("fileProgress", function(e, progress) {
        $scope.fileProgress = $filter('number')(progress.loaded / progress.total * 100, 1) + " %";
    });

    $scope.uploadPhoto = function ($fileContent) {
        $scope.profileData.avatarSrc = $fileContent || "img/ionic.png";
        var currentUser = Parse.User.current();
        if (currentUser) {
          $scope.debugInfo = $fileContent;
          var name = "avatar-" + $stateParams.profileId + ".png";
          var fileDataArray = $fileContent.split(';base64,');
          var fileData = {
            base64: fileDataArray[1],
            data: fileDataArray[0].split('data:')[1]
          };
          var parseFile = new Parse.File(name, { base64: fileData.base64 });
          !$scope.profileData && ($scope.profileData = defaultData);
          parseFile.save().then(function() {
            // The file has been saved to Parse.
            $scope.$apply(function () {
                $scope.profileData.avatar = parseFile;
                $scope.profileData.avatarSrc = parseFile.url() || $scope.profileData.avatarSrc;
            });
          },
          function(error) {
            // The file either could not be read, or could not be saved to Parse.
            $scope.debugInfo = 'file saving error: ' + angular.toJson(error, true);
          });
        }
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
                      $scope.debugInfo = 'profile saving error: ' + angular.toJson(error, true);
                    }
                });
              },
              error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                $scope.debugInfo = 'user getting error: ' + angular.toJson(error, true);
              }
            });
          }
      }, function (error) {
        $scope.debugInfo = 'profile getting error: ' + angular.toJson(error, true);
      });
    };
  }]);