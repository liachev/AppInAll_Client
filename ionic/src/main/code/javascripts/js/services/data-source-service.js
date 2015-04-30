/// How to use:
/// (1) see ionic/src/main/code/javascripts/js/controllers/ui-tree.js controller example
/// (2) see ionic/src/main/code/templates/ui-tree.html template
/// (3) see ionic/src/main/code/templates/ui-node.html template example
/// (4) see ionic/src/main/code/javascripts/js/app.js:
///         state app.tree-view-array for DataSource from array
///         state app.tree-view-table for DataSource from parse.com table

angular.module('utils.services')

.factory('DataSource', ['$q', 'ParseSDK', function ($q, Parse) {
    var data = [];

    var that = this;
    var defaultOptions = that.options = {
        maxDepth: 0, // 0 - means unlimited nesting
        titleColumnName: "title",
        parentColumnName: "parentId",
    };

    var setParentColumnName = function (columnName) {
        var deferred = $q.defer();
        if (typeof columnName !== "string") {
            deferred.reject("Argument is not a string");
            return deferred.promise;
        }
        that.options.parentColumnName = columnName;
        deferred.resolve(that);
        return deferred.promise;
    }

    var setTitleColumnName = function (columnName) {
        var deferred = $q.defer();
        if (typeof columnName !== "string") {
            deferred.reject("Argument is not a string");
            return deferred.promise;
        }
        that.options.titleColumnName = columnName;
        deferred.resolve(that);
        return deferred.promise;
    }

    var setMaxDepth = function (depth) {
        var deferred = $q.defer();
        if (!angular.isNumber(depth)) {
            deferred.reject("Argument is not a number");
            return deferred.promise;
        }
        that.options.maxDepth = depth;
        deferred.resolve(that);
        return deferred.promise;
    }

    var resetOptions = function () {
        var deferred = $q.defer();
        that.options = defaultOptions;
        deferred.resolve(that);
        return deferred.promise;
    }

    var getData = function () {
        var deferred = $q.defer();
        deferred.resolve(that.data || []);
        return deferred.promise;
    };

    var fromJson = function (json) {
        var deferred = $q.defer();
        if (typeof json !== "string") {
            deferred.reject("Argument is not a string");
            return deferred.promise;
        }
        fromArray(angular.fromJson(json)).then(function (array) {
            that.data = array;
            deferred.resolve(that.data || []);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    var fromArray = function (array) {
        var deferred = $q.defer();
        if (!angular.isArray(array)) {
            deferred.reject("Argument is not an array");
            return deferred.promise;
        }
        that.data = array;
        deferred.resolve(that.data || []);
        return deferred.promise;
    };

    var fromDbTable = function (tableName, root) { // use 'null' to get all root nodes
        var deferred = $q.defer();
        if (typeof tableName !== "string") {
            deferred.reject("Argument is not a string");
            return deferred.promise;
        }
        var table = Parse.Object.getClass(tableName);
        that.data = [];
        makeTree(table, that.data, root, 0, []).then(function (tree) {
            deferred.resolve(that.data || []);
        });
        return deferred.promise;
    }

    function makeTree(table, nodes, node, depth, requests) {
        var deferred = $q.defer();
        if (depth < that.options.maxDepth || that.options.maxDepth === 0) {
            getChilds(table, node).then(function (array) { // get child nodes for `node` from `table`
                for (var i = 0; i < array.length; i++) {
                    var defer = $q.defer();
                    requests.push(defer);
                    var item = array[i];
                    var newNode = {
                        item: item,
                        title: item.get(that.options.titleColumnName),
                        depth: depth + 1,
                        nodes: []
                    };
                    var pushed = nodes.push(newNode);
                    makeTree(table, nodes[pushed - 1].nodes, item, newNode.depth, requests).then(function (result) {
                        if (!angular.isUndefined(node) && node !== null) {
                            node.nodes = result;
                        }
                        defer.resolve(result);
                    }, function (error) {
                        deferred.reject(error);
                        defer.reject(error);
                    });
                }
                $q.all(requests).then(function () {
                    deferred.resolve();
                });
            });
        } else {
            deferred.resolve(); // don't load anymore child nodes if maximum depth limit is exceeded
        }
        return deferred.promise;
    }

    function getChilds (table, node) {
        var query = new Parse.Query(table);
        query.equalTo(that.options.parentColumnName, node);
        return query.find({
            success: function (results) {
                Parse.Promise.as(results);
            },
            error: function (error) {
                Parse.Promise.error(error);
            }
        });
    }

    return {
        getData: getData,
        fromJson: fromJson,
        fromArray: fromArray,
        fromDbTable: fromDbTable,
        setTitleColumnName: setTitleColumnName,
        setMaxDepth: setMaxDepth,
        setParentColumnName: setParentColumnName,
        resetOptions: resetOptions,
    };
}]);