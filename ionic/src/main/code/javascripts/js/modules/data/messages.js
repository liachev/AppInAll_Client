
/*
    Usage note:
 var messages = new (Parse.Collection.getClass("Messages"));
 messages.sendMessage(
    (new Parse.Collection.getClass("Profile").set("objectId", "1eTa4kvHx2")),
    (new Parse.Collection.getClass("Profile").set("objectId", "Y21EIpg3TJ")),
    'Title',
    'Text message',
    [{attachName:"img.jpg", attachData:"..."}],
    function(result) {
        logging.log("Messages.sendMessage: " + JSON.stringify(result));
    },
    function(result, error) {
        logging.error("[Messages.getMessageList] Error: " + error.code + " " + error.message);
    });

 */

angular.module('appinall.models.messages', ['parse-angular.enhance'])

    .run(function(){
        var Message = Parse.Object.extend({
            className: "Messages",
            attrs: ['toProfile', 'fromProfile', 'title', 'message', 'attachments']
        });

        var Messages = Parse.Collection.extend({
            model: Message,

            // We give a className to be able to retrieve the collection
            // from the getClass helper.
            className: "Messages",

            getMessageList: function(toProfile, fromProfile, successCallback, errorCallback) {
                var query = new Parse.Query(Message);
                query.equalTo("toProfile", toProfile);
                query.equalTo("fromProfile", fromProfile);
                query.find({
                    success: successCallback,
                    error: errorCallback
                });
            },

            sendMessage: function(toProfile, fromProfile, title, message, attachments, successCallback, errorCallback) {
                var m_message = new Message();
                m_message.set("toProfile", toProfile);
                m_message.set("fromProfile", fromProfile);
                m_message.set("title", title);
                m_message.set("message", message);
                m_message.set("attachments", attachments);

                m_message.save(null, {
                    success: successCallback,
                    error: errorCallback
                });
            },

            retrievingMessageObject: function(objectId, successCallback, errorCallback) {
                var query = new Parse.Query(Message);
                query.get(objectId, {
                    success: successCallback,
                    error: errorCallback
                });
            },

            deleteMessage: function(message, successCallback, errorCallback) {
                message.destroy({
                    success: successCallback,
                    error: errorCallback
                });
            }
        });
    });