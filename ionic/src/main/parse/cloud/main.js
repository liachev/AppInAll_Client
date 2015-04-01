
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("LoggerInfo", function(request, response) {
  console.log(request.params.log);
  response.success(request.params);
});

Parse.Cloud.define("LoggerError", function(request, response) {
  console.error(request.params.log);
  response.success(request.params);
});