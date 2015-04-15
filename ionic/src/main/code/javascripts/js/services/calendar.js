
function calendarOnSuccess(msg) {
    logging.info('Calendar success: ' + JSON.stringify(msg));
}

function calendarOnError(msg) {
    logging.error('Calendar error: ' + JSON.stringify(msg));
}

angular.module('cordova_calendar',[])

    .factory('calendarService', function($window) {
        return {
            createEvent: function createEvent(title,location,notes,startDate,endDate,success,error) {
                $window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
            },
            deleteEvent: function deleteEvent(newTitle, location, notes, startDate, endDate, success, error) {
                $window.plugins.calendar.deleteEvent(newTitle, location, notes, startDate, endDate, success, error);
            }
        };
    });
