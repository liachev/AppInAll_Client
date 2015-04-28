angular.module('ui-tree.controllers', ['ui.tree'])

.controller('UITreeCtrl', ['$q', '$http', '$scope', 'data', function ($q, $http, $scope, source) {
    $scope.data = source;

    $scope.options = { };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.canExpand = function (node) {
        return (node && node.nodes && node.nodes.length == 0);
    };
}]);