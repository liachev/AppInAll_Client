/*
 *  HOW TO USE(EXAMPLE):
 *  logging.debug("debug", "message"); //variable args
 *  output: DEBUG[2015/03/27-12:35:32]:debug message
 *  info: Time in UTC+0
 *  [logging.debug(), logging.error(), logging.info(), logging.log()]
 */

var getStrDate = function() {
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
};

var parseLog = function(strLog) {
    Parse.Cloud.run('LoggerInfo', {log:strLog}, {
        success: function(result) {
            console.log(result);
        },
        error: function(error) {
            console.error(error);
        }
    });
};

var parseError = function(strLog) {
    Parse.Cloud.run('LoggerError', {log:strLog}, {
        success: function(result) {
            console.log(result);
        },
        error: function(error) {
            console.error(error);
        }
    });
};

var logging = {
    debug : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        parseLog("DEBUG" + getStrDate() + ":" + str);
    },
    error : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        parseError("ERROR" + getStrDate() + ":"  + str);
    },
    info : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        parseLog("INFO" + getStrDate() + ":"  + str);
    },
    log : function () {
        var str = "";
        for(var i=0; i<arguments.length; i++)
        {
            if(i != 0)
                str += " ";
            str += arguments[i];
        }
        parseLog("LOG" + getStrDate() + ":"  + str);
    }
};