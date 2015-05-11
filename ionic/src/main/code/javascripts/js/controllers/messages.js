
angular.module('messages.controllers', [])

    .controller('MessagesCtrl', ['$rootScope', '$state', '$interval', 'localStorageService',
        function ($scope, $state, $interval, localStorageService) {
            if(!$scope.chatData)
                $scope.chatData = {attachments:[]};

            var chatCheck_promise;
            var log_key; // chat log     - array of messages
            var mem_key; // chat members - array of styles for display left or right message in chat

            //=== user check ===
            var currentUser = Parse.User.current();
            if (currentUser) {
                Parse.User.current().fetch().then(function (user) {
                    var selectedProfile = user.get("selectedProfile");

                    if(selectedProfile)
                    {
                        $scope.chatData.currentProfile = selectedProfile;
                        $scope.chatData.chatWithProfile = selectedProfile; // TODO: chat to userself

                        mem_key = "chatMem_id" + $scope.chatData.chatWithProfile.id;
                        log_key = "chatLog_id" + $scope.chatData.chatWithProfile.id;

                    }else{
                        logging.error("[MessagesCtrl.MessagesCtrl] Profile hasn't been selected yet");
                        return;
                    }
                });
            } else {
                $state.go('app.signup'); // show the signup or login page
            }
            //=== === ===

            //tool function
            var arraysEqual = function(a, b, parseObj) {
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length != b.length) return false;

                // If you don't care about the order of the elements inside
                // the array, you should sort both arrays here.

                if(parseObj)
                {
                    // a - parseObj; b - array from parse obj
                    for (var i = 0; i < a.length; ++i) {
                        if (a[i].id !== b[i].objectId) return false;
                    }
                    return true;
                }else{
                    for (var i = 0; i < a.length; ++i) {
                        if (a[i] !== b[i]) return false;
                    }
                    return true;
                }
            };

            // defenition controller functions
            $scope.goChat = function (name) {
                if(!$scope.chatData.currentProfile) return; // don't go chat if profile is not selected

                $scope.checkChat();
                if(!chatCheck_promise)
                    chatCheck_promise = $interval($scope.checkChat, 1000); // check chat every 1 sec
                $state.go('app.chat');
            };

            $scope.sendMessage = function () {
                var parseMessage = new (Parse.Collection.getClass("Messages"));
                if(!$scope.chatData.message && !$scope.chatData.attachments.length) return; // don't send empty message
                parseMessage.sendMessage(
                    $scope.chatData.chatWithProfile,
                    $scope.chatData.currentProfile,
                    $scope.chatData.title,
                    $scope.chatData.message,
                    $scope.chatData.attachments,
                    function() {
                        logging.log("sendMessage: Success");
                        $scope.checkChat(); // refresh chat log
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" + error.code);
                    });

                $scope.chatData.title = undefined;
                $scope.chatData.message = undefined;
                $scope.chatData.attachments = undefined;
            };

            $scope.addAttach = function ($fileContent) {
                // TODO
            };

            $scope.checkChat = function() {
                if(!$state.is('app.chat') && chatCheck_promise) { // state is not a chat
                    $interval.cancel(chatCheck_promise);
                    chatCheck_promise = undefined;
                    return;
                }

                var parseMessage = new (Parse.Collection.getClass("Messages"));
                parseMessage.getChatWith($scope.chatData.chatWithProfile,
                    function(messages) {
                        var messages_member = [];
                        for(var i = 0; i < messages.length; i++)
                        {
                            if(messages[i].get("fromProfile").id === $scope.chatData.currentProfile.id)
                                messages_member.push("chat_message_userself blue-grey lighten-3");
                            else
                                messages_member.push("chat_message_interlocutor");
                        }

                        if(!$scope.chatData.messages_member || !$scope.chatData.messages_log)
                        {
                            $scope.chatData.messages_member = messages_member; // 0 - userself, 1 - interlocutor
                            $scope.chatData.messages_log = messages;           // array of parseObjs Messages
                        }

                        if( arraysEqual(messages_member, localStorageService.get(mem_key)      ) &&
                            arraysEqual(messages,        localStorageService.get(log_key), true) ){
                            return;
                        }else{
                            $scope.chatData.messages_member = messages_member;
                            $scope.chatData.messages_log = messages;

                            localStorageService.set(mem_key, $scope.chatData.messages_member);
                            localStorageService.set(log_key, $scope.chatData.messages_log);
                        }
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" + error.code);
                    });
            };

        }]);
