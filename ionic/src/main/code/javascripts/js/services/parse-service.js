angular.module('ParseServices', [])

.factory('ParseSDK', function() {

  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
  Parse.initialize("O7eCGvKWO5BihNXJQv8zU0Ewd9a5nLJs0EBZWFjr", "Aohwuhy4j63Rs9tL4kXuc4lD8zGqv6wgrI74yXnU");

//  // FACEBOOK init
//  window.fbPromise.then(function() {
//
//    Parse.FacebookUtils.init({
//
//      // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
//      appId: 481650395275919, // Facebook App ID
//      channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
//      cookie: true, // enable cookies to allow Parse to access the session
//      xfbml: true, // parse XFBML
//      frictionlessRequests: true // recommended
//
//    });
//
//  });

    return Parse;
});