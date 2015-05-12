angular.module('createEvent.controllers', ['ionic'])

.controller('CreateEventCtrl', ['$rootScope', '$http', '$state', 'ParseSDK', '$ionicModal', '$ionicPopup', '$timeout',
    function ($scope, $http, $state, Parse, $ionicModal, $ionicPopup, $timeout) {
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

        $scope.change = function () {
            switch ($scope.createEventData.location) {
                case 'current':
                    $scope.showAlert()
                    break
                case 'address':
                    $scope.addressEditOpen()
                    break
                case 'online':
                    $scope.createEventData.location = 'online'
                    break
                default:
                    alert('not determined')
            }
        }

        // Modal Windows
        $ionicModal.fromTemplateUrl('addressEdit.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.addressEditOpen = function() {
            $scope.modal.show();
        };
        $scope.addressEditClose = function() {
            $scope.modal.hide();
        };

        // Popup Windows
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Warning',
                template: 'Not implemented yet'
            });
            $timeout(function() {
                alertPopup.close();
            }, 1000);
        };
    }]);