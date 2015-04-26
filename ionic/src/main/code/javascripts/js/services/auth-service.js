angular.module('auth.services', [])

.factory('AuthService', ['$rootScope', '$log', 'ParseSDK', function($rootScope, $log, Parse) {
    $rootScope.isUnique = false;
    return {
        //checks if a field is unique (ie email or username on signup).
        checkUniqueValue: function(id, property, value, callback) {
            var data = {
                id: id,
                property: property,
                value: value
            };

            switch (data.id) {
                case "users":
                    switch (data.property) {
                        case "email":
                            var users = new (Parse.Collection.getClass("_User")); // TODO: must be changed later
                            var user = users.loadUsersWithEmail(value).then(function (results) {
                                $log.info("results = " + angular.toJson(results, true));
                                $rootScope.isUnique = (results.length == 0);
                                $log.info("$rootScope.isUnique = " + $rootScope.isUnique);

                                (callback || angular.noop)($rootScope.isUnique);
                            });
                            break;
                        default:
                            $log.warn("[AuthService.checkUniqueValue] " + angular.toJson(data, true));
                            break;
                    };
                    break;
                default:
                    $log.warn("[AuthService.checkUniqueValue] " + angular.toJson(data, true));
                    break;
            };

            return $rootScope.isUnique;
        }
    };
}]);