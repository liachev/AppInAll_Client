
angular.module('welcomePage.controllers', [])

.controller('welcomePageCtrl', ['$rootScope', 'localStorageService',
    function($scope, localStorageService) {
        $scope.isWelcomePage = function() {
            return !localStorageService.get("welcome-page"); // return true if welcome-page key is null
        };
    }])

    .directive('welcomePage', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/welcome.html',
            controller: function($scope, $window, $http, localStorageService, $state){
                $scope.browse = function() {
                    localStorageService.set("welcome-page", true);
                    $state.go('app.browse');
                };
                $scope.signup = function() {
                    localStorageService.set("welcome-page", true);
                    $state.go('app.signup');
                };

                $scope.welcomePage_activeSlide = 0;

                var icSizeList = [512, 144, 96, 48];
                $scope.welcomePage_iconSize = icSizeList[icSizeList.length-1];

                $http.get('json/welcomePage.json').success(function(data) {
                    for(var i = 0; i < data.slider.length; i++)
                        data.slider[i].description = data.slider[i].description.split('\n');
                    $scope.welcomePage_data = data;
                });

                $scope.$watch(function(){
                    return $window.innerWidth;
                }, function(value) {
                    for (var i = 0; i < icSizeList.length; i++) {
                        if ($window.innerWidth >= icSizeList[i] + 64) {
                            $scope.welcomePage_iconSize = icSizeList[i];
                            break;
                        }
                    }
                });
            },
            controllerAs: "welcomeCtrl"
        };
    });
