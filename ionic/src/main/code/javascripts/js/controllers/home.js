angular.module('home.controllers', [])

.controller('HomeCtrl', ['$scope', '$state', 'menu', function ($scope, $state, menu) {
    $scope.menuItems = menu.MenuItems;

    $scope.onSearch = function () {
        $state.go('app.search');
    };
}]);
