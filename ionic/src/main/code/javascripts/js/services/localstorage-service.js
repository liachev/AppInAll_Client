var g_storageFile = "appinall_storagedata.json";

angular.module('localstorage')

    .factory('LocalStorage', function() {
        var parsedJSON;
        return {
            setItem: function setItem(key) {
                readFile(g_dirEntry, g_storageFile, function(str) {
                    parsedJSON = JSON.parse(str);
                    if(typeof parsedJSON === "object") {
                        parsedJSON.key = key;
                        console.log("LocalStorageFactory:setItem;key " + key); // #debugAA
                    }else{
                        parsedJSON = {key : key};
                    }
                    writeFile(g_dirEntry, g_storageFile, JSON.stringify(parsedJSON));
                });
            },
            getItem: function getItem(successCallback) {
                readFile(g_dirEntry, g_storageFile, function(str){
                    parsedJSON = JSON.parse(str);
                    if(typeof successCallback === "function")
                        if(typeof parsedJSON === "object") {
                            if(typeof parsedJSON.key === "number") {
                                console.log("LocalStorageFactory:getItem;key " +
                                parsedJSON.key); // #debugAA
                                successCallback(parsedJSON.key);
                            }else{
                                successCallback(0); // parsedJSON.key isn't a number
                            }
                        }else{
                            successCallback(0); // parsedJSON isn't a object
                        }
                });
            },

            getAccessToken: function getAccessToken(successCallback) {
                readFile(g_dirEntry, g_storageFile, function(str){
                    parsedJSON = JSON.parse(str);
                    if(typeof successCallback === "function")
                        if(typeof parsedJSON === "object") {
                            if(typeof parsedJSON.access_token === "number") {
                                console.log("LocalStorageFactory:getAccessToken;access_token " +
                                parsedJSON.access_token); // #debugAA
                                successCallback(parsedJSON.access_token);
                            }else{
                                successCallback(0); // parsedJSON.key isn't a number
                            }
                        }else{
                            successCallback(0); // parsedJSON isn't a object
                        }
                });
            },
            setAccessToken: function setAccessToken(access_token) {
                readFile(g_dirEntry, g_storageFile, function(str) {
                    parsedJSON = JSON.parse(str);
                    if(typeof parsedJSON === "object") {
                        parsedJSON.access_token = access_token;
                    }else{
                        parsedJSON = {access_token : access_token};
                    }
                    console.log("LocalStorageFactory:setAccessToken;access_token " + access_token); // #debugAA
                    writeFile(g_dirEntry, g_storageFile, JSON.stringify(parsedJSON));
                });
            },
            getActiveUser: function getActiveUser(successCallback) {
                readFile(g_dirEntry, g_storageFile, function(str){
                    parsedJSON = JSON.parse(str);
                    if(typeof successCallback === "function")
                        if(typeof parsedJSON === "object") {
                            if(typeof parsedJSON.active_user === "number") {
                                console.log("LocalStorageFactory:getAccessToken;active_user " +
                                parsedJSON.active_user); // #debugAA
                                successCallback(parsedJSON.active_user);
                            }else{
                                successCallback(0); // parsedJSON.key isn't a number
                            }
                        }else{
                            successCallback(0); // parsedJSON isn't a object
                        }
                });
            },
            setActiveUser: function setActiveUser(active_user) {
                readFile(g_dirEntry, g_storageFile, function(str) {
                    parsedJSON = JSON.parse(str);
                    if(typeof parsedJSON === "object") {
                        parsedJSON.active_user = active_user;
                    }else{
                        parsedJSON = {active_user : active_user};
                    }
                    console.log("LocalStorageFactory:setActiveUser;active_user - " + active_user); // #debugAA
                    writeFile(g_dirEntry, g_storageFile, JSON.stringify(parsedJSON));
                });
            }
        };
    });