
angular.module('messages.controllers', [])

    .controller('MessagesCtrl', ['$rootScope',
        '$state',
        '$stateParams',
        'KEYS',
        '$location',
        '$interval',
        'localStorageService',
        '$ionicScrollDelegate',
        function ($scope,
                  $state,
                  $stateParams,
                  KEYS,
                  $location,
                  $interval,
                  localStorageService,
                  $ionicScrollDelegate) {
            if(!$scope.chatData)
                $scope.chatData = {attachments:[]}; // current message to interlocutor

            if(!$scope.chatData.currentProfile) {
                var currentProfile = localStorageService.get("Parse/" + KEYS.APPLICATION_ID + "/currentUser");
                if(currentProfile && currentProfile.selectedProfile)
                    $scope.chatData.currentProfile = currentProfile.selectedProfile;
                else
                    $state.go('app.profiles');
            }

            if(!$scope.chatCheck_promise)
                $scope.chatCheck_promise = undefined;
            var log_key; // chat log     - array of messages
            var mem_key; // chat members - array of styles for display left or right message in chat
            var needScroll = false;

            $scope.MSG_STYLE_USERSELF = "chat_message_userself blue-grey lighten-3";
            $scope.COL_STYLE_USERSELF = "col s10 offset-s2";
            $scope.MSG_STYLE_INTERLOCUTOR = "chat_message_interlocutor";
            $scope.COL_STYLE_INTERLOCUTOR = "col s10";

            /*=== === Functions declaration === ===*/
            /* tool functions */
            var arraysEqual = function(a, b, parseObj) {
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length != b.length) return false;

                // If you don't care about the order of the elements inside
                // the array, you should sort both arrays here.

                var i;
                if(parseObj)
                {
                    // a - parseObj; b - array from parse obj
                    for (i = 0; i < a.length; ++i) {
                        if (a[i].id !== b[i].objectId) return false;
                    }
                    return true;
                }else{
                    for (i = 0; i < a.length; ++i) {
                        if (a[i] !== b[i]) return false;
                    }
                    return true;
                }
            };
            var urlToBase64 = function(url, resending_arg, outputFormat){
                var defer = jQuery.Deferred();
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var img = new Image;
                img.crossOrigin = 'Anonymous';
                img.onload = function(){
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img,0,0);
                    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                    // Clean up
                    canvas = null;

                    defer.resolve(dataURL, resending_arg);
                };
                img.src = url;
                return defer.promise();
            };
            function pad(num, size) {
                var s = num+"";
                while (s.length < size) s = "0" + s;
                return s;
            }
            //$scope
            $scope.ionicContent_getOffsetHeight = function() {
                needScroll_check();
                var ionicContent_offsetHeight = document.getElementById('chat-footer').offsetHeight;
                return {'bottom' : ionicContent_offsetHeight + 'px'};
            };
            var needScroll_check = function() {
                if(needScroll) {
                    $ionicScrollDelegate.scrollBottom();
                    needScroll = false;
                }
            };
            angular.element(document).ready(function () {
                if($state.is('app.chat')) {
                    $ionicScrollDelegate.scrollBottom();
                }
            });
            $scope.getMessageTime = function(idx) {
                if($scope.chatData.messages_log && $scope.chatData.messages_log[idx]) {
                    var date = new Date($scope.chatData.messages_log[idx].createdAt);
                    var str_date = '';

                    str_date += pad(date.getHours(), 2) + ':';
                    str_date += pad(date.getMinutes(), 2);
                    return str_date;
                }
            };
            /* /tool functions */
            $scope.goChat = function (profileId) {
                $location.path("/app/chat/" + profileId);
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
                    function(message) {
                        logging.log("sendMessage: Success");

                        var msg = JSON.parse(JSON.stringify(message));
                        msg.attachments = $scope.localstorage_attachments;
                        delete $scope.localstorage_attachments;

                        if(!$scope.chatData.messages_log) $scope.chatData.messages_log = [];
                        if(!$scope.chatData.messages_member) $scope.chatData.messages_member = [];

                        $scope.chatData.messages_log.push(msg);
                        $scope.chatData.messages_member.push($scope.MSG_STYLE_USERSELF);

                        localStorageService.set(mem_key, $scope.chatData.messages_member);
                        localStorageService.set(log_key, $scope.chatData.messages_log);
                        // $scope.checkChat(); // refresh chat log #maybe it is not topical now
                        needScroll = true;
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" + error.code);
                    }
                );

                $scope.chatData.title = undefined;
                $scope.chatData.message = undefined;
                $scope.chatData.attachments = [];
            };
            $scope.addAttach = function ($files) {
                var files_length = $files.length;
                for(var i = 0; i < files_length; i++)
                    if($files[i].type.indexOf("image") < 0) {
                        logging.log("Only images supported yet");
                        $files.splice(i, 1);
                        continue;
                    }

                if(!$scope.localstorage_attachments) $scope.localstorage_attachments = [];
                $scope.localstorage_attachments = $scope.localstorage_attachments.concat($files);
                needScroll = true;

                var shift_i = $scope.chatData.attachments.length;

                for(var i = 0; i < $files.length; i++) {
                    var parseFile = new Parse.File($files[i].name, { base64: $files[i].base64 }, $files[i].type);
                    parseFile.save().then(function(file) {
                        var parseName = file.name();
                        var async_i;
                        for(var j = 0; j < $files.length; j++) {
                            // don't use FIFO array because save promises call in random order
                            // name in the end of parseName
                            if(parseName.slice(parseName.indexOf($files[j].name))===$files[j].name) {
                                async_i = j;
                                break;
                            }
                        }
                        $scope.chatData.attachments[shift_i + async_i] =
                        {
                            name: $files[async_i].name,
                            type: $files[async_i].type,
                            file: {
                                __type: "File",
                                name: file.name(),
                                url: file.url()
                            }
                        };
                    }, function(error) {
                        logging.error("parseFile.save() error: " + JSON.stringify(error));
                    });
                }
            };
            $scope.cancel_attach = function(idx) {
                $scope.chatData.attachments.splice(idx, 1);
                $scope.localstorage_attachments.splice(idx, 1);
                needScroll = true;
            };
            $scope.checkChat = function() {
                if(!$state.is('app.chat') && $scope.chatCheck_promise) { // state is not a chat
                    $interval.cancel($scope.chatCheck_promise);
                    $scope.chatCheck_promise = undefined;
                    return;
                }

                if(!$scope.isChatChecking) $scope.isChatChecking = true;
                else return;

                var parseMessage = new (Parse.Collection.getClass("Messages"));
                parseMessage.getChatWith($scope.chatData.chatWithProfile,
                    function(messages) {
                        var messages_member = [], i, j;
                        for(i = 0; i < messages.length; i++)
                        {
                            if(messages[i].get("fromProfile").id === $scope.chatData.currentProfile.objectId)
                                messages_member.push($scope.MSG_STYLE_USERSELF);
                            else
                                messages_member.push($scope.MSG_STYLE_INTERLOCUTOR);
                        }

                        if( arraysEqual(messages_member, localStorageService.get(mem_key)      ) &&
                            arraysEqual(messages,        localStorageService.get(log_key), true) )
                        {
                            $scope.isChatChecking = false;
                            return;
                        }else{
                            /* find difference between nMsg_log and oMsg_log */
                            var nMsg_log = JSON.parse(JSON.stringify(messages));
                            var oMsg_log = localStorageService.get(log_key) || [];
                            var new_msg = [], msg_log = [];
                            for(i = 0; i < nMsg_log.length; i++) {
                                var isCached = false;
                                for(j = 0; j < oMsg_log.length; j++) {
                                    if(nMsg_log[i].objectId == oMsg_log[j].objectId)
                                        isCached = true;
                                }
                                if(!isCached) new_msg.push(nMsg_log[i]);
                                else msg_log.push(nMsg_log[i]);
                            }
                            if(!new_msg.length) {
                                $scope.isChatChecking = false;
                                return;
                            }

                            /* convert url to base64 */
                            var promises = [];
                            for(i = 0; i < new_msg.length; i++)
                            {
                                var attach = new_msg[i].attachments;
                                if(attach)
                                    for(j = 0; j < attach.length; j++) {
                                        var promise = urlToBase64(attach[j].file.url, {"j": j, "i": i});
                                        promise.then(function(response, resending_arg) {
                                            var base64 = response.split("base64,")[1];

                                            var async_i = resending_arg.i;
                                            var async_j = resending_arg.j;
                                            new_msg[async_i].attachments[async_j].base64 = base64;
                                            delete new_msg[async_i].attachments[async_j].file;
                                        });
                                        promises.push(promise);
                                    }
                            }

                            Promise.all(promises).then(function() {
                                $scope.chatData.messages_member = messages_member;

                                // merge cached messages and parsed new
                                msg_log = msg_log.concat(new_msg);
                                // sort by date
                                msg_log.sort(function(a, b) {
                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                });

                                $scope.chatData.messages_log = msg_log;

                                localStorageService.set(mem_key, $scope.chatData.messages_member);
                                localStorageService.set(log_key, $scope.chatData.messages_log);

                                $scope.isChatChecking = false;
                                needScroll = true;
                            });
                            // /*attachments url to base64*
                        }
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" + error.code);
                    });
            };
            /*=== === /Functions declaration === ===*/

            //=== enter to chat ===
            if($state.is('app.chat')) {
                $scope.ionicContent_offsetHeight = document.getElementById('chat-footer').offsetHeight;
                if(!$scope.chatData.currentProfile)
                    $state.go('app.profiles'); // don't go chat if profile is not selected
                if(!$stateParams.profileId)
                    $state.go('app.messages'); // don't go chat if profileId is undefined

                $scope.chatData.chatWithProfile = {
                    "__type" : "Pointer",
                    "className":"Profile",
                    "objectId" : $stateParams.profileId
                };

                mem_key = "chatMem_id" + $scope.chatData.chatWithProfile.objectId;
                log_key = "chatLog_id" + $scope.chatData.chatWithProfile.objectId;

                $scope.chatData.messages_member = localStorageService.get(mem_key);
                $scope.chatData.messages_log = localStorageService.get(log_key);

                $scope.checkChat();
                if(!$scope.chatCheck_promise)
                    $scope.chatCheck_promise = $interval($scope.checkChat, 2500); // check chat every 2.5 sec
            }
            //=== === ===


        }]);
