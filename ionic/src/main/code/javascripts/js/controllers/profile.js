angular.module('profile.controllers', [])

.controller('ProfileCtrl', ['$window', '$scope', '$http', '$stateParams', function($window, $scope, $http, $stateParams) {
  $scope.profileData = defaultData = {
    gender: 'N'
  };

  $http.get('translate/signup/strings.json').success(function(result) {
      $scope.strings = result;
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
    $scope.profileData = defaultData;
    $window.history.back();
  };

  $scope.save = function () {
    alert('Not implemented yet') // TODO: complete saving
  };
}]);