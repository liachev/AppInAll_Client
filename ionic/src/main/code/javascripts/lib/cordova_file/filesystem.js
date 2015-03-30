// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

var g_dirEntry;
var g_bDeviceIsReady = false;
// device APIs are available
//
function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
        fs.root.getDirectory("data", {create:true, exclusive:false}, function(dirEntry) {
            g_dirEntry = dirEntry;
            g_bDeviceIsReady = true;

            readFile(g_dirEntry, g_logFile, logSuccessRead);
        }, fail);
    }, fail);
    logging.info("Application started");
}

var writeFile = function(dirEntry, filename, text, bAppend) {
    if(g_bDeviceIsReady) {
        bAppend = (typeof bAppend === 'undefined') ? false : bAppend;
        dirEntry.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
            if (bAppend) {
                var previousLog = "";
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        previousLog = evt.target.result;
                        fileEntry.createWriter(function (writer) {
                            writer.write(previousLog + text + "\n");
                        }, fail);
                    };
                    reader.readAsText(file);
                });
            } else {
                fileEntry.createWriter(function (writer) {
                    writer.write(text + "\n");
                }, fail);
            }
        }, fail);
    }
};

function readFile(dirEntry, filename, successCallback, errorCallback) {
    if(g_bDeviceIsReady)
    {
        var bFileRead = false;
        var readString = "";
        dirEntry.getFile(filename, {create: true, exclusive: false}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    readString = evt.target.result;
                    bFileRead = true;
                    if(typeof successCallback === "function")
                        successCallback(readString);
                };
                reader.readAsText(file);
            });
        }, fail);
    }else{
        if(typeof errorCallback === "function")
            errorCallback("Trying to read a file when device isn't ready");
    }
}

function fail(error) {
    console.error(error.code);
}