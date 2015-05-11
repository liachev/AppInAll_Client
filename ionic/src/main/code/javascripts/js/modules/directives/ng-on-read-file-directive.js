angular.module('starter')

.directive('ngOnReadFile', ['$parse', 'FileReader', function ($parse, reader) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.ngOnReadFile);

			element.on('change', function(onChangeEvent) {
				var files = (onChangeEvent.srcElement || onChangeEvent.target).files;
				var parsed_files = [];
				var parsed_indexes = [];

				for(var i = 0; i < files.length; i++) {
					var file = {};
					file.name = files[i].name;
					file.type = files[i].type;
					parsed_indexes.push(i);
					parsed_files.push(file); // <- First In (FIFO)

					// TODO: bug with async function call. Files with other names.
					reader.readAsDataUrl(files[i], scope).then(function(content) {
						var async_i = parsed_indexes.shift(); // <- First Out (FIFO)
						if(async_i === undefined) {
							fn(scope, { $files: parsed_files });
							return;
						}

						parsed_files[async_i].base64 = content.split(';base64,')[1];
						if(!parsed_indexes.length) fn(scope, { $files: parsed_files });
					});
				}
			});
		}
	};
}]);
