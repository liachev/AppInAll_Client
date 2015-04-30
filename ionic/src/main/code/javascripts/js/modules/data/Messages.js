
/*
 Usage note:
 var messages = new (Parse.Collection.getClass("Messages"));
 messages.sendMessage(
 toProfile,     // parse
 fromProfile,  // objects
 'Title',
 'Text message',
 [{attachName:file, attachData:"..."}], // TODO
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

            // get current with other profile chat
            getChatWith: function(profile, successCallback, errorCallback) {
                var toCurQuery = new Parse.Query(Message);
                var fromCurQuery = new Parse.Query(Message);
                var selectedProfile;

                Parse.User.current().fetch().then(function (user) {
                    selectedProfile = user.get("selectedProfile");

                    if(!selectedProfile)
                    {
                        logging.error("[MessagesCtrl.goChat()] Profile hasn't been selected yet");
                        return;
                    }

                    toCurQuery.equalTo("toProfile", selectedProfile);
                    toCurQuery.equalTo("fromProfile", profile);
                    fromCurQuery.equalTo("toProfile", profile);
                    fromCurQuery.equalTo("fromProfile", selectedProfile);

                    var mainQuery = Parse.Query.or(toCurQuery, fromCurQuery);

                    mainQuery.find({
                        success: successCallback,
                        error: errorCallback
                    });
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

            retrievingMessageObject: function(messageId, successCallback, errorCallback) {
                var query = new Parse.Query(Message);
                query.get(messageId, {
                    success: successCallback,
                    error: errorCallback
                });
            },

            // returns array of profiles
            getChatList: function(successCallback, errorCallback) {
                var chatList = [];
                var query;
                var currentUser = Parse.User.current();
                if(!currentUser) {
                    logging.error("Messages.getChatList: current User is undefined");
                    return;
                }

                var selectedProfile = currentUser.get("selectedProfile");
                // ======   =====   =====   =====   ===== //
                // search chats from selectedProfile
                query = new Parse.Query(Message);
                query.equalTo("fromProfile", selectedProfile);

                query.find().then(function(result) {
                    var profile;
                    for (var i = 0; i < result.length; i++)
                    {
                        profile = result[i].get("toProfile");
                        if(chatList.indexOf(profile) === -1) chatList.push(profile);
                    }
                    // ======   =====   =====   =====   ===== //
                    // search chats to selectedProfile
                    query = new Parse.Query(Message);
                    query.equalTo("toProfile", selectedProfile);

                    query.find().then(function(result) {
                        var profile;
                        for (var i = 0; i < result.length; i++)
                        {
                            profile = result[i].get("fromProfile");
                            if(chatList.indexOf(profile) === -1) chatList.push(profile);
                        }

                        successCallback(chatList);
                        // ======   =====   =====   =====   ===== //
                    }, errorCallback);
                }, errorCallback);
            },

            deleteMessage: function(message, successCallback, errorCallback) {
                message.destroy({
                    success: successCallback,
                    error: errorCallback
                });
            }
        });
    });
