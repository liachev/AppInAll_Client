(function () {


    angular.module('events.controllers', ['restangular', 'angular.filter'])
        .config(function (RestangularProvider) {
            /* $routeProvider.
             when('/', {
             controller: 'EventsCtrl',
             templateUrl: 'list.html'
             });*/
            RestangularProvider.setBaseUrl('http://api.meetup.com/2/');
            RestangularProvider.setDefaultRequestParams({key: '7d132ee2e1d226377b79753a5b3c48'});
            RestangularProvider.setJsonp(true);
            RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
            RestangularProvider.setDefaultHeaders({
                'Content-Type': 'application/json'
            });

            RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                var extractedData;
                if (operation === "getList") {
                    extractedData = data.results;
                    extractedData.meta = data.meta;
                } else {
                    extractedData = data.data;
                }
                return extractedData;
            });

        })
        .factory('MeetupEvents', ['$rootScope', '$log', 'Restangular', function ($scope, $log, Restangular) {
            return {
                loadedEvents: function (categoryId) {
                    var params = {
                        category: categoryId,
                        "photo-host": "public",
                        zip: "02184",
                        radius: 10,
                        page: 20,
                        "only": "id,name,time,venue"
                    };

                    return Restangular.all("open_events").getList(params);

                },
                loadedAllEvents: function () {
                    var params = {
                        "photo-host": "public",
                        zip: "02184",
                        radius: 10,
                        page: 20,
                        "only": "id,name,time,venue"
                    };

                    return Restangular.all("open_events").getList(params);

                },
                loadMore: function (url) {
                    return Restangular.allUrl('open_events', url).customGETLIST();
                }

            };
        }])
        .
        controller('EventsCtrl', ['$rootScope', '$stateParams', '$log', 'MeetupEvents', '$filter',
            function ($scope, $stateParams, $log, Events, $filter) {

            $scope.events = [];
            $scope.allEvents = [];
            $scope.next = "";

            $scope.category = angular.fromJson($stateParams.category);

            if (!angular.isUndefined($scope.category) && $scope.category !== null) {
                Events.loadedEvents($scope.category.meetUpId).then(function (events) {
                    $scope.events = events;
                    $scope.next = events.meta.next;
                });
            } else {
                Events.loadedAllEvents().then(function (events) {
                    $scope.allEvents = events;
                    $scope.next = events.meta.next;
                });
            }


            $scope.loadMore = function () {

                if ($scope.next === "") {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                Events.loadMore($scope.next).then(function (events) {
                    if (!angular.isUndefined($scope.category) && $scope.category !== null) {
                        $scope.events = $scope.events.concat(events);
                    } else {
                        $scope.allEvents = $scope.allEvents.concat(events);
                    }
                    $scope.next = events.meta.next;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

            };

            $scope.mapping = function (item) {
                return {
                    id: item.id,
                    name: item.name,
                    date: new Date($filter('date')(item.time, 'fullDate')).getTime(),
                    time: $filter('date')(item.time, 'shortTime'),
                    venue: item.venue
                };
            };
        }])

    ;

})
();