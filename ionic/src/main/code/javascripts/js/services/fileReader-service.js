angular.module('utils.services', [])

.factory('FileReader', ['$q', '$log', function ($q, $log) { // additional async read bugfix. Arg for idx etc.
  var onLoad = function(reader, deferred, scope, additional_arg) {
      return function () {
          scope.$apply(function () {
              deferred.resolve({"content": reader.result, "additional_arg": additional_arg});
          });
      };
  };

  var onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  var onProgress = function(reader, scope) {
      return function (event) {
          scope.$broadcast("fileProgress",
              {
                  total: event.total,
                  loaded: event.loaded
              });
      };
  };

  var getReader = function(deferred, scope, additional_arg) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope, additional_arg);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
  };

  var readAsDataURL = function (file, scope, additional_arg) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope, additional_arg);
      file && reader.readAsDataURL(file);

      return deferred.promise;
  };

  return {
      readAsDataUrl: readAsDataURL
  };
}]);