angular.module('utils.services')

.factory('DataSource', ['$q', function ($q) {
    var data = [];

    var getData = function () {
        var deferred = $q.defer();
        deferred.resolve(data || []);
        return deferred.promise;
    };

    var fromJson = function (json) {
        var deferred = $q.defer();
        if (typeof json !== "string") {
            deferred.reject("Argument is not a string");
            return deferred.promise;
        }
        fromArray(angular.fromJson(json)).then(function (array) {
            data = array;
            deferred.resolve(data);
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
        data = array;
        deferred.resolve(data);
        return deferred.promise;
    };

    return {
        getData: getData,

        fromJson: fromJson,

        fromArray: fromArray
    };
}]);