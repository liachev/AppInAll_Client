/*
 *  HOW TO USE(EXAMPLE):
 *  logging.debug("debug", "message"); //variable args
 *  output: DEBUG[2015/03/27-12:35:32]:debug message
 *  info: -Time in UTC+0
 *        -log puts in buffer until event pause then log writes in data/appinall.log file
 *        -when application is starting log sends on parse.com
 *  [logging.debug(), logging.error(), logging.info(), logging.log()]
 */

var g_logFile = "appinall.log";
var logArray = [];

document.addEventListener("pause", onPause, false);

function onPause() {
    if(logArray.length){
        writeFile(g_dirEntry, g_logFile, logArray.join('\n'), true);
        logArray = [];
    }
}

function logSuccessRead(string)
{
    // JS string - 2 bytes per character
    if(string.length/2 > 1024*1024*100) { // more than 100kb
        string = "";
        writeFile(g_dirEntry, g_logFile, ""); // log clearing
    }
    if(string.length) {
        parseInfo(string);
        writeFile(g_dirEntry, g_logFile, ""); // log clearing
    }
}

function getStrDate() {
    var date = new Date();
    var strDate = "["
        + date.getUTCFullYear() + "/"
        + date.getUTCMonth() + "/"
        + date.getUTCDate() + "-"
        + date.getUTCHours() + ":"
        + date.getUTCMinutes() + ":"
        + date.getUTCSeconds()
        + "]";
    return strDate;
}

function parseInfo(strLog) {
    Parse.Cloud.run('LoggerInfo', {log:strLog}, {
        success: function(result) {
            console.log(result);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function parseError(strLog) {
    Parse.Cloud.run('LoggerError', {log:strLog}, {
        success: function(result) {
            console.log(result);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

var logging = {
    debug : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        logArray.push("DEBUG" + getStrDate() + ":" + str);
    },
    error : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        logArray.push("ERROR" + getStrDate() + ":"  + str);
    },
    info : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        logArray.push("INFO" + getStrDate() + ":"  + str);
    },
    log : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        logArray.push("LOG" + getStrDate() + ":"  + str);
    }
};