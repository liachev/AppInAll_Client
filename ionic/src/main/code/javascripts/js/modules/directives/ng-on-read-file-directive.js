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
                var files_read = 0;

                for(var i = 0; i < files.length; i++) {
                    var file = {};
                    file.name = files[i].name;
                    file.type = files[i].type;
                    parsed_files.push(file);

                    reader.readAsDataUrl(files[i], scope, i).then(function(data) {
                        var content = data.content;
                        var async_i = data.additional_arg;
                        if(async_i === undefined) {
                            fn(scope, { $files: parsed_files });
                            return;
                        }
                        files_read++;

                        parsed_files[async_i].base64 = content.split(';base64,')[1];
                        if(files_read == files.length) fn(scope, { $files: parsed_files });
                    });
				}
			});
		}
	};
}]);
