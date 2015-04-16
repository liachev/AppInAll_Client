// usage: ionic/src/main/appinall/plugins/nl.x-services.plugins.calendar/demo/index.html
// factory works the same way like 'git usage':
// https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin#3-usage
// use calendarOnSuccess and calendarOnError functions in successCallback and errorCallback
function calendarOnSuccess(msg) {
    logging.info('Calendar success: ' + JSON.stringify(msg));
}

function calendarOnError(msg) {
    logging.error('Calendar error: ' + JSON.stringify(msg));
}

angular.module('cordova_calendar', [])

    .factory('calendarService', function($window) {
        return {
            getCreateCalendarOptions: function getCreateCalendarOptions() {
                return $window.plugins.calendar.getCreateCalendarOptions();
            },

            createCalendar: function createCalendar(calendarNameOrOptionsObject, successCallback, errorCallback) {
                $window.plugins.calendar.createCalendar(calendarNameOrOptionsObject, successCallback, errorCallback);
            },

            deleteCalendar: function deleteCalendar(calendarName, successCallback, errorCallback) {
                $window.plugins.calendar.deleteCalendar(calendarName, successCallback, errorCallback);
            },

            openCalendar: function openCalendar(date, successCallback, errorCallback) {
                $window.plugins.calendar.openCalendar(date, successCallback, errorCallback);
            },

            getCalendarOptions: function getCalendarOptions() {
                return $window.plugins.calendar.getCalendarOptions();
            },

            createEventWithOptions: function createEventWithOptions(title, location, notes, startDate, endDate, options, successCallback, errorCallback) {
                $window.plugins.calendar.createEventWithOptions(title, location, notes, startDate, endDate, options, successCallback, errorCallback);
            },

            createEvent: function createEvent(title, location, notes, startDate, endDate, successCallback, errorCallback) {
                $window.plugins.calendar.createEvent(title, location, notes, startDate, endDate, successCallback, errorCallback);
            },

            createEventInteractively: function createEventInteractively(title, location, notes, startDate, endDate, successCallback, errorCallback) {
                $window.plugins.calendar.createEventInteractively(title, location, notes, startDate, endDate, successCallback, errorCallback);
            },

            createEventInNamedCalendar: function createEventInNamedCalendar(title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback) {
                $window.plugins.calendar.createEventInNamedCalendar(title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback);
            },

            deleteEvent: function deleteEvent(title, location, notes, startDate, endDate, successCallback, errorCallback) {
                $window.plugins.calendar.deleteEvent(title, location, notes, startDate, endDate, successCallback, errorCallback);
            },

            deleteEventFromNamedCalendar: function deleteEventFromNamedCalendar(title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback) {
                $window.plugins.calendar.deleteEventFromNamedCalendar(title, location, notes, startDate, endDate, calendarName, successCallback, errorCallback);
            },

            // iOS only
            findEvent: function findEvent(title, location, notes, startDate, endDate, successCallback, errorCallback) {
                $window.plugins.calendar.findEvent(title, location, notes, startDate, endDate, successCallback, errorCallback);
            },

            findAllEventsInNamedCalendar: function findAllEventsInNamedCalendar(calendarName, successCallback, errorCallback) {
                $window.plugins.calendar.findAllEventsInNamedCalendar(calendarName, successCallback, errorCallback);
            },

            modifyEvent: function modifyEvent(title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, successCallback, errorCallback) {
                $window.plugins.calendar.modifyEvent(title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, successCallback, errorCallback);
            },

            modifyEventInNamedCalendar: function modifyEventInNamedCalendar(title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, calendarName, successCallback, errorCallback) {
                $window.plugins.calendar.modifyEventInNamedCalendar(title, location, notes, startDate, endDate, newTitle, newLocation, newNotes, newStartDate, newEndDate, calendarName, successCallback, errorCallback);
            },

            listEventsInRange: function listEventsInRange(startDate, endDate, successCallback, errorCallback) {
                $window.plugins.calendar.listEventsInRange(startDate, endDate, successCallback, errorCallback);
            },

            listCalendars: function listCalendars(successCallback, errorCallback) {
                $window.plugins.calendar.listCalendars(successCallback, errorCallback);
            }
        };
    });
