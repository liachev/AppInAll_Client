angular.module('FacebookServices', ['ngCordova'])

.factory('fbConnect', ['$cordovaFacebook', function($cordovaFacebook){
    return $cordovaFacebook;
}]);