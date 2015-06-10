angular.module('createEvent.controllers', ['ionic'])

.controller('CreateEventCtrl', ['$rootScope', '$http', '$state', 'ParseSDK', '$ionicModal', '$ionicPopup', '$timeout',
    function ($scope, $http, $state, Parse, $ionicModal, $ionicPopup, $timeout) {
        $scope.createEventData = {
            location: "current",
            radio: "publish",
            notificationSelect: "default",
            paymentPeriod: "month",
            IsCheckedFee: "free",
            IsCheckedSeats: "unlimited"
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

        $scope.periodArr = [];
        $http.get('json/subscription_payment_period.json').success(function (results) {
            for (var i = 0; i < results.length; i++) {
                $scope.periodArr[i] = {
                    value: results[i].value,
                    name: results[i].name
                }
            }
            $scope.createEventData.age = $scope.ages[0].value;
        }).error(function (data) {
            alert(data || 'error');
        });

        $scope.changeSelect = function () {
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
            $scope.addressModal = modal;
        });
        $scope.addressEditOpen = function() {
            $scope.addressModal.show();
        };
        $scope.addressEditClose = function() {
            $scope.addressModal.hide();
        };

        $ionicModal.fromTemplateUrl('restrictions.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.restrictionsModal = modal;
        });
        $scope.restrictionsOpen = function() {
            $scope.restrictionsModal.show();
        };
        $scope.restrictionsClose = function() {
            $scope.restrictionsModal.hide();
        };

        $ionicModal.fromTemplateUrl('fee.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.feeModal = modal;
        });
        $scope.feeOpen = function() {
            $scope.feeModal.show();
        };
        $scope.feeClose = function() {
            $scope.feeModal.hide();
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