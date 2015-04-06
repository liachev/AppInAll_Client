angular.module('profile.controllers', [])

.controller('ProfileCtrl', ['$window', '$scope', '$http', '$stateParams', function($window, $scope, $http, $stateParams) {
  $scope.profileData = defaultData = {
    gender: 'N'
  };

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
    $window.history.back();
    $scope.profileData = defaultData;
  };

  $scope.save = function () {
    alert('Not implemented yet\n\n' + angular.toJson($scope.profileData, true)) // TODO: complete saving
    $window.history.back();
  };
}]);