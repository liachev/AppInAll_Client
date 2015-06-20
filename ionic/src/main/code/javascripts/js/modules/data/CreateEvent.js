angular.module('appinall.models.createEvent', ['parse-angular.enhance'])

.run(function() {
    var Event = Parse.Object.extend({
        className: "Event",
        attrs: [
            "eventName",
            "avatar",
            "description",
            "startTime",
            "endTime",
            "location",
            "privacy",
            "gender",
            "age",
            "notification",
        ]
    });
    var Event = Parse.Collection.extend({
        model: Event,

        // We give a className to be able to retrieve the collection
        // from the getClass helper.
        className: "Event",

        getEvent: function (event) {
            var query = new Parse.Query(Event);
            query.equalTo("event", event);
            var result = query.find({
                success: function (event) {
                }
            });
            return result;
        },

        addEvent: function (createEventData) {
            // save request_id to Parse
            var _this = this;

            return _this.fetchProfileData(createEventData).then(function (event) {
                // perform a save and return the promised object back into the Angular world
                return profile.save().then(function (object) {
                    // here object === profile basically
                    _this.add(object);
                    return object;
                })
            });
        },

        removeEvent: function (event) {
            if (!this.get(event))
                return false;

            var _this = this;
            return profile.destroy().then(function () {
                _this.remove(event);
            });
        },

        fetchEventData: function (data) {
            var event = this.get(data.id) || new Event;
            event.set("eventName", data.eventName);
            event.set("description", data.description);
            event.set("startTime", data.startTime);
            event.set("endTime", data.endTime);
            event.set("location", data.location);
            event.set("privacy", data.privacy);
            event.set("gender", data.gender);
            event.set("age", data.age);
            event.set("notification", data.notification);

            return event;
        }

    })
    });