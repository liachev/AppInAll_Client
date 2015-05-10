angular.module('ui-tree.controllers', ['ui.tree'])

.controller('UITreeCtrl', ['$q', '$http', '$scope', 'DataSource', 'data', 'tableName', function ($q, $http, $scope, dataSource, source, tableName) {
    $scope.data = source;

    $scope.options = { };

    $scope.nodeRendererUri = 'templates/ui-node.html';
    $scope.title = tableName.trim() === "" ? "Example" : tableName;

    $scope.node_click = function(scope, node) {
      if (!tableName || tableName.trim() === "") {
        scope.toggle(); // simply toggle the current node, if the data source is not a db table
      } else {
        if (node && (angular.isArray(node.nodes) && node.nodes.length === 0 || angular.isUndefined(node.nodes))) {
            (function (node, dataSource) {
                dataSource.fromDbTable(tableName, node && node.item || null).then(function (nodes) {
                    node.nodes = nodes // uploading child nodes for current node
                });
            })(node, dataSource); // if node doesn't have child nodes upload them ...
        } else {
            scope.toggle(); // ... else toggle node
        }
      }
    };

    $scope.canExpand = function (node) {
        return (node && node.nodes && node.nodes.length == 0);
    };
}]);