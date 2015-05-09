angular.module('createEvent.controllers', ['ionic'])

.controller('CreateEventCtrl', ['$rootScope', '$http', '$state', 'ParseSDK', '$ionicModal',
    function ($scope, $http, $state, Parse, $ionicModal) {
        $scope.createEventData = {
            location: "current",
            radio: "publish"
        };

        $scope.privacyArr = [];
        $http.get('json/privacy.json').success(function (results) {
            for (var i = 0; i < results.length; i++) {
                $scope.privacyArr[i] = {
                    value: results[i].value,
                    name: results[i].name
                }
            }
            $scope.createEventData.privacy = $scope.privacyArr[0].value;
        }).error(function (data) {
            alert(data || 'error');
        });

        $scope.genderArr = [];
        $http.get('json/gender.json').success(function (results) {
            for (var i = 0; i < results.length; i++) {
                $scope.genderArr[i] = {
                    value: results[i].value,
                    name: results[i].name
                }
            }
            $scope.createEventData.gender = $scope.genderArr[0].value;
        }).error(function (data) {
            alert(data || 'error');
        });

        $scope.ages = [];
        $http.get('json/age_group.json').success(function (results) {
            for (var i = 0; i < results.length; i++) {
                $scope.ages[i] = {
                    value: results[i].value,
                    name: results[i].name
                }
            }
            $scope.createEventData.age = $scope.ages[0].value;
        }).error(function (data) {
            alert(data || 'error');
        });

    }]);