angular.module('starter')

.directive('ngOnReadFile', ['$parse', 'FileReader', function ($parse, reader) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.ngOnReadFile);

			element.on('change', function(onChangeEvent) {
				var file = (onChangeEvent.srcElement || onChangeEvent.target).files[0];

				reader.readAsDataUrl(file, scope).then(function(file) {
					fn(scope, { $fileContent: file });
				});
			});
		}
	};
}]);
