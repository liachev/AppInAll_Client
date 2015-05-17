
/*
 See usage in: MessagesCtrl
 */

angular.module('appinall.models.messages', ['parse-angular.enhance',
    'LocalStorageModule',
    'parse.services',
    'appinall.models.profiles'])

    .run(function(localStorageService, KEYS){
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
                var currentUser = localStorageService.get("Parse/" + KEYS.APPLICATION_ID + "/currentUser");
                if(currentUser && currentUser.selectedProfile)
                    selectedProfile = currentUser.selectedProfile;
                else {
                    logging.error("[Messages.getChatWith()] Profile hasn't been selected yet");
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

            // returns array of profiles
            getChatList: function(successCallback, errorCallback) {
                var chatList = [];
                var queryTo = new Parse.Query(Message);
                var queryFrom = new Parse.Query(Message);

                var selectedProfile;
                var currentUser = localStorageService.get("Parse/" + KEYS.APPLICATION_ID + "/currentUser");
                if(currentUser && currentUser.selectedProfile)
                    selectedProfile = currentUser.selectedProfile;
                else {
                    logging.error("[Messages.getChatList()] Profile hasn't been selected yet");
                    return;
                }
                // ======   =====   =====   =====   ===== //
                // search chats with selectedProfile
                queryTo.equalTo("fromProfile", selectedProfile);
                queryFrom.equalTo("toProfile", selectedProfile);

                var mainQuery = Parse.Query.or(queryTo, queryFrom);

                mainQuery.find().then(function(result) {
                    function isInArray(itemId, parseObjs) {
                        for(var i = 0; i < parseObjs.length; i++) {
                            if(parseObjs[i].objectId == itemId)
                                return i;
                        }
                        return -1;
                    }
                    function getParseObj(obj) {
                        var id = (typeof obj.id != 'undefined')? obj.id: obj.objectId;
                        return {
                            __type: "Pointer",
                            className: "Profile",
                            objectId: id
                        }
                    }
                    var profileTo, profileFrom, i;
                    for (i = 0; i < result.length; i++)
                    {
                        profileTo = result[i].get("toProfile");
                        profileFrom = result[i].get("fromProfile");

                        if(profileTo && profileTo.id != selectedProfile.objectId) {
                            if(isInArray(profileTo.id, chatList) == -1) chatList.push(getParseObj(profileTo));
                        }
                        else if(profileFrom && profileFrom.id != selectedProfile.objectId) {
                            if(isInArray(profileFrom.id, chatList) == -1) chatList.push(getParseObj(profileFrom));
                        }
                        else if(profileFrom && profileFrom.id == selectedProfile.objectId ||
                            profileTo && profileTo.id   == selectedProfile.objectId) {
                            if(isInArray(selectedProfile.objectId, chatList) == -1) chatList.push(selectedProfile);
                        }
                        else{
                            errorCallback("Strange query result");
                            return;
                        }
                    }
                    for(i = 0; i < chatList.length; i++) {
                        // TODO: done the function
                        var query = new Parse.Query(Profile);
                        query.get(chatList[i], {
                            success: function (profile) {
                                return profile;
                            },
                            error: function (object, error) {
                                logging.error("Chat with unexisting profile");
                            }
                        })
                    }
                    successCallback(chatList);

                }, errorCallback);
            },

            retrievingMessageObject: function(messageId, successCallback, errorCallback) {
                var query = new Parse.Query(Message);
                query.get(messageId, {
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
