angular.module('createEvent.controllers', ['ionic'])

.controller('CreateEventCtrl', ['$rootScope', '$http', '$state', 'ParseSDK', '$ionicModal', '$ionicPopup', '$timeout',
    function ($scope, $http, $state, Parse, $ionicModal, $ionicPopup, $timeout) {
        $scope.createEventData = {
            location: "current",
            radio: "publish",
            notificationSelect: "default",
            paymentPeriod: { value: "month", name: "month" },
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
        };

        $scope.$watch('createEventData.IsCheckedSeats', function (newValue, oldValue) {
            switch (newValue) {
                case 'unlimited':
                    $scope.restrictions = $scope.strings.restrictionsModal.radio.radioUnlimited;
                    break;
                case 'limited':
                    $scope.restrictions = $scope.strings.restrictionsModal.radio.radioMax.onePart + ' ' +
                        $scope.createEventData.seatsValue + ' ' +
                        $scope.strings.restrictionsModal.radio.radioMax.twoPart;
                    break;
            }
        });

        $scope.$watch('createEventData.seatsValue', function (newValue, oldValue) {
            if (!newValue) { return; }
            $scope.restrictions = $scope.strings.restrictionsModal.radio.radioMax.onePart + ' ' +
                newValue + ' ' +
                $scope.strings.restrictionsModal.radio.radioMax.twoPart;
        });

        $scope.$watch('createEventData.IsCheckedFee', function (newValue, oldValue) {
            switch (newValue) {
                case 'free':
                    $scope.fee = $scope.strings.feeModal.radio.free;
                    break;
                case 'one_time_payment':
                    $scope.fee = $scope.strings.feeModal.radio.one_time_payment + ' ' +
                                 $scope.createEventData.OneTimePrise;
                    break;
                case 'subscription_payment':
                    $scope.fee = $scope.strings.feeModal.radio.Subscription.text + ' ' +
                                 $scope.createEventData.SubscriptionPrise + ' ' +
                                 $scope.strings.feeModal.radio.Subscription.every + ' ' +
                                 $scope.createEventData.paymentPeriod.value;
                    break;
            }
        });

        $scope.$watch('createEventData.OneTimePrise', function (newValue, oldValue) {
            if (!newValue) { return; }
            $scope.fee = $scope.strings.feeModal.radio.one_time_payment + ' ' + newValue;
        });

        $scope.$watch('createEventData.SubscriptionPrise', function (newValue, oldValue) {
            if (!newValue || !$scope.createEventData.paymentPeriod.value) { return; }
            $scope.fee = $scope.strings.feeModal.radio.Subscription.text + ' ' +
                $scope.createEventData.SubscriptionPrise + ' ' +
                $scope.strings.feeModal.radio.Subscription.every + ' ' +
                $scope.createEventData.paymentPeriod.value;
        });

        $scope.$watch('createEventData.paymentPeriod', function (newValue, oldValue) {
            if (!newValue || !$scope.createEventData.SubscriptionPrise) { return; }
            $scope.fee = $scope.strings.feeModal.radio.Subscription.text + ' ' +
                $scope.createEventData.SubscriptionPrise + ' ' +
                $scope.strings.feeModal.radio.Subscription.every + ' ' +
                $scope.createEventData.paymentPeriod.value;
        });
        var tmpData = {};
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

        $scope.addressEditApply = function () {
            tmpData = angular.copy($scope.createEventData);
            // TODO: save data to server
            $scope.addressModal.hide();
        };

        $ionicModal.fromTemplateUrl('restrictions.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.restrictionsModal = modal;
        });
        $scope.restrictionsOpen = function() {
            tmpData = angular.copy($scope.createEventData);
            $scope.restrictionsModal.show();
        };
        $scope.restrictionsClose = function() {
            $scope.createEventData = angular.copy(tmpData);
            $scope.restrictionsModal.hide();
        };
        $scope.restrictionsApply = function () {
            tmpData = angular.copy($scope.createEventData);
            // TODO: save data to server
            $scope.restrictionsModal.hide();
        };

        $ionicModal.fromTemplateUrl('fee.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.feeModal = modal;
        });
        $scope.feeOpen = function() {
            tmpData = angular.copy($scope.createEventData);
            $scope.feeModal.show();
        };
        $scope.feeClose = function() {
            $scope.createEventData = angular.copy(tmpData);
            $scope.feeModal.hide();
        };
        $scope.feeApply = function () {
            tmpData = angular.copy($scope.createEventData);
            // TODO: save data to server
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