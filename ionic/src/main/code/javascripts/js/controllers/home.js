angular.module('home.controllers', [])

.controller('HomeCtrl', ['$scope', '$ionicSideMenuDelegate', function ($scope) {
    $scope.categories = [{
            id: 'weather',
            name: 'Weather',
            icon: 'ion-ios-cloud',
            icon_outline: 'ion-ios-cloud-outline'
        }, {
            id: 'events',
            name: 'Events'
        }, {
            id: 'groups',
            name: 'Groups',
            icon: 'ion-ios-people',
            icon_outline: 'ion-ios-people-outline'
        }, {
            id: 'venues',
            name: 'Venues'
        }, {
            id: 'entertaiment',
            name: 'Entertaiment'
        }, {
            id: 'services',
            name: 'Services'
        }, {
            id: 'business',
            name: 'Business'
        }, {
            id: 'sell_buy',
            name: 'Sell / Buy'
        }
    ];
}]);
