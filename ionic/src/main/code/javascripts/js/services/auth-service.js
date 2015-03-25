angular.module('signup.controllers')

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
                            var users = new (Parse.Collection.getClass("TestUser")); // TODO: must be changed later
                            var user = users.loadUsersWithEmail(value).then(function (results) {
                                $log.info("results = " + JSON.stringify(results));
                                $rootScope.isUnique = (results.length == 0);
                                $log.info("$rootScope.isUnique = " + $rootScope.isUnique);

                                (callback || angular.noop)($rootScope.isUnique);
                            });
                            break;
                        default:
                            $log.warn("[AuthService.checkUniqueValue] " + JSON.stringify(data));
                            break;
                    };
                    break;
                default:
                    $log.warn("[AuthService.checkUniqueValue] " + JSON.stringify(data));
                    break;
            };

            return $rootScope.isUnique;
        }
    };
}]);