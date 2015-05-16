
angular.module('messages.controllers', [])

    .controller('MessagesCtrl', ['$rootScope',
        '$state',
        '$stateParams',
        'KEYS',
        '$location',
        '$interval',
        'localStorageService',
        '$ionicScrollDelegate',
        '$window',
        function ($scope,
                  $state,
                  $stateParams,
                  KEYS,
                  $location,
                  $interval,
                  localStorageService,
                  $ionicScrollDelegate,
                  $window) {
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
            // keys for localStorageService
            var log_key; // chat log     - array of messages
            var mem_key; // chat members - array of styles for display left or right message in chat
            var chatList_key; // list of profiles
            var needScroll = false;

            $scope.MSG_STYLE_USERSELF = "chat_message_userself";
            $scope.MSG_STYLE_INTERLOCUTOR = "chat_message_interlocutor";
            $scope.ATTR_FLEX = "80";
            $scope.ATTR_OFFSET = "20";

            /*=== === Functions declaration === ===*/
            /* tool functions */
            function arraysEqual(a, b, parseObj) {
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
            }
            function urlToBase64(url, resending_arg, outputFormat){
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
            }
            function pad(num, size) {
                var s = num+"";
                while (s.length < size) s = "0" + s;
                return s;
            }
            function isInArray(itemId, parseObjs) {
                for(var i = 0; i < parseObjs.length; i++) {
                    if(parseObjs[i].objectId == itemId)
                        return i;
                }
                return -1;
            }
            function sortListByDate(list) {
                list.sort(function(a, b) {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                return list;
            }
            function refreshMessages(nMsg_log, oMsg_log) {
                var msg_log = [], isNew = false;
                if(!nMsg_log || !nMsg_log.length) return {"msg_log":msg_log, "isNew":isNew};
                if(!oMsg_log || !oMsg_log.length) return {"msg_log":nMsg_log, "isNew":true};
                nMsg_log = sortListByDate(nMsg_log);
                oMsg_log = sortListByDate(oMsg_log);

                var nMsg_eldestDate = new Date(nMsg_log[0].createdAt);
                var nMsg_newestDate = new Date(nMsg_log[nMsg_log.length-1].createdAt);

                var i, n;
                // add new msg with old msg priority
                for(i = 0; i < nMsg_log.length; i++) {
                    if((n = isInArray(nMsg_log[i].objectId, oMsg_log)) > -1) {
                        msg_log.push(oMsg_log[n]);
                        oMsg_log.splice(n, 1);
                    }else{
                        isNew = true;
                        msg_log.push(nMsg_log[i]);
                    }
                }
                // delete old msg in date of new
                for(i = 0; i < oMsg_log.length; i++) {
                    var date = new Date(oMsg_log[i].createdAt);
                    if(date >= nMsg_eldestDate && date <= nMsg_newestDate) {
                        isNew = true;
                        oMsg_log.splice(i, 1);
                    }
                }
                msg_log = msg_log.concat(oMsg_log);
                msg_log = sortListByDate(msg_log);
                return {"msg_log":msg_log, "isNew":isNew};
            }
            function isNeedScroll_check() {
                if(needScroll) {
                    $ionicScrollDelegate.scrollBottom();
                    needScroll = false;
                }
            }
            //$scope
            angular.element(document).ready(function () {
                if($state.is('app.chat')) {
                    $ionicScrollDelegate.scrollBottom();
                }
            });
            $scope.ionicContent_getOffsetHeight = function() {
                isNeedScroll_check();
                var ionicContent_offsetHeight = document.getElementById('chat-footer').offsetHeight;
                return {'bottom' : ionicContent_offsetHeight + 'px'};
            };
            $scope.getMessageTime = function(idx) {
                if($scope.chatData.messages_log && $scope.chatData.messages_log[idx]) {
                    var date = new Date($scope.chatData.messages_log[idx].createdAt);
                    var str_date = '';

                    str_date += pad(date.getHours(), 2) + ':';
                    str_date += pad(date.getMinutes(), 2);
                    return str_date;
                }
            };
            $scope.getUserStyle = function(user, style_u, style_i) {
                if(user.indexOf('USERSELF') > -1) {
                    return style_u;
                }
                else if(user.indexOf('INTERLOCUTOR') > -1) {
                    return style_i;
                }else{
                    return '';
                }
            };
            $scope.isImageAttach = function(attach) {
                return (attach.type.indexOf("image") > -1);
            };
            /* /tool functions */
            $scope.openAttach = function(attach) {
                var link = 'data:' + attach.type + ';base64,' + attach.base64;
                $window.open(link);
            };
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
                        $scope.chatData.messages_member.push('MSG_STYLE_USERSELF');

                        localStorageService.set(mem_key, $scope.chatData.messages_member);
                        localStorageService.set(log_key, $scope.chatData.messages_log);
                        // $scope.checkChat(); // refresh chat log #maybe it is not topical now
                        needScroll = true;
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" +  JSON.stringify(error));
                    }
                );

                $scope.chatData.title = undefined;
                $scope.chatData.message = undefined;
                $scope.chatData.attachments = [];
            };
            $scope.addAttach = function ($files) {
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
                                messages_member.push('MSG_STYLE_USERSELF');
                            else
                                messages_member.push('MSG_STYLE_INTERLOCUTOR');
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

                            var refreshed = refreshMessages(nMsg_log, oMsg_log);
                            var new_msg = refreshed.msg_log;
                            var isNew = refreshed.isNew;

                            if(!isNew) {
                                $scope.isChatChecking = false;
                                return;
                            }

                            /* convert url to base64 */
                            var promises = [];
                            for(i = 0; i < new_msg.length; i++)
                            {
                                var attach = new_msg[i].attachments;
                                if(attach && attach.length && attach[0].hasOwnProperty('file'))
                                    for(j = 0; j < attach.length; j++) {
                                        if(attach[j].type.indexOf("image") > -1) { // only image file
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
                            }

                            Promise.all(promises).then(function() {
                                $scope.chatData.messages_member = messages_member;

                                // sort by date
                                new_msg.sort(function(a, b) {
                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                });

                                $scope.chatData.messages_log = new_msg;

                                localStorageService.set(mem_key, $scope.chatData.messages_member);
                                localStorageService.set(log_key, $scope.chatData.messages_log);

                                $scope.isChatChecking = false;
                                needScroll = true;
                            });
                            // /*attachments url to base64*
                        }
                    },
                    function(error) {
                        logging.error("sendMessage: Error:" + JSON.stringify(error));
                    });
            };
            /*=== === /Functions declaration === ===*/

            //=== enter to chat ===
            if($state.is('app.messages')) {
                if(!$scope.chatData.currentProfile)
                    $state.go('app.profiles'); // don't go chat if profile is not selected

                /* TODO: done the function
                 chatList_key = "chatList_" + $scope.chatData.currentProfile.objectId;
                 var chatList = new (Parse.Collection.getClass("Messages"));
                 chatList.getChatList(function(profiles) {
                 var nChatList = JSON.parse(JSON.stringify(profiles));
                 var oChatList = localStorageService.get(chatList_key);
                 if(!oChatList) oChatList = [];
                 if(!$scope.chatList) $scope.chatList = [];
                 if(!profiles || !profiles.length) {
                 $scope.chatList = [];
                 return;
                 }

                 var i, n, isNew;
                 // get parsed profiles from storage
                 for(i = 0; i < nChatList.length; i++) {
                 if((n = isInArray(nChatList[i].objectId, oChatList)) > -1) {
                 $scope.chatList.push(oChatList[n]);
                 oChatList.splice(n, 1);
                 }else{
                 isNew = true;
                 $scope.chatList.push(profiles[i]);
                 }
                 }

                 if(isNew)
                 for(i = 0; i < $scope.chatList.length; i++) {
                 if($scope.chatList[i]) {

                 }
                 }

                 }, function(error) {
                 logging.error("getChatList: Error:" + JSON.stringify(error));
                 });
                 */
            }
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

                mem_key = "chatMem_" + $scope.chatData.currentProfile.objectId + "/" + $scope.chatData.chatWithProfile.objectId;
                log_key = "chatLog_" + $scope.chatData.currentProfile.objectId + "/" + $scope.chatData.chatWithProfile.objectId;

                $scope.chatData.messages_member = localStorageService.get(mem_key);
                $scope.chatData.messages_log = localStorageService.get(log_key);

                $scope.checkChat();
                if(!$scope.chatCheck_promise)
                    $scope.chatCheck_promise = $interval($scope.checkChat, 2500); // check chat every 2.5 sec
            }
            //=== === ===


        }]);
