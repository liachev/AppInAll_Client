(function () {
    'use strict';

    var angularMapboxExample = angular.module('mapBox.controllers', ['events.controllers', 'angular-mapbox']);

    angularMapboxExample.controller('eventsOnMapCtrl', function ($scope, $state, $timeout, $ionicSideMenuDelegate, mapboxService, MeetupEvents, ParseSDK) {
        mapboxService.init(
            {
                accessToken: 'pk.eyJ1IjoiZGVuaXNwb2xpc2giLCJhIjoidEQ3WGZWVSJ9.jQfaI-BmgXzEv0gzk5QdrQ'

            });
        $timeout(function () {
            var map = mapboxService.getMapInstances()[0];
            //mapboxService.fitMapToMarkers(map);
        }, 100);

        $scope.events = [];
        MeetupEvents.loadedEvents().then(function (events) { //loadedEvents($scope.category.meetUpId)
            $scope.events = events;
        });


        $scope.mapMovedCallback = function (bounds) {
            console.log('You repositioned the map to:');
            console.log(bounds);
        };

        $scope.mapZoomedCallback = function (bounds) {
            console.log('You zoomed the map to:');
            console.log(bounds.getCenter().toString());
        };

        $scope.createEvent = function () {
            var currentUser = ParseSDK.User.current();
            if (!$ionicSideMenuDelegate.isOpen() && currentUser === null) {
                $scope.showActionSheet();
            } else {
                $state.go('app.createEvent');
            }
        };
    });

})();