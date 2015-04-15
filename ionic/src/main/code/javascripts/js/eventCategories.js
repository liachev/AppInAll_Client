(function () {


    angular.module('eventCategories.controllers', [])

        .controller('CategoriesCtrl', ['$rootScope', '$state', '$log', 'ParseSDK', function ($scope, $state, $log, Parse) {

            $scope.categories = [];

            var categories = new (Parse.Collection.getClass("Category"));

            categories.loadCategories().then(function (results) {
                $scope.categories = results;
            });


        }]);


    angular.module('appinall.models.category', ['parse-angular.enhance'])

        .run(function () {
            var Category = Parse.Object.extend({
                className: "Category",
                attrs: ['meetUpId', 'name', 'shortName'],
                meetUpId: function () {
                    return this.get('meetUpId');
                },
                shortName: function () {
                    return this.get('shortName');
                }
            });

            var Categories = Parse.Collection.extend({
                model: Category,
                // We give a className to be able to retrieve the collection
                // from the getClass helper.
                className: "Category",
                comparator: function (model) {
                    return model.meetUpId();
                },
                loadCategories: function () {
                    this.query = (new Parse.Query(Category));
                    // use the enhanced load() function to fetch the collection
                    return this.query.find({
                        success: function (results) {

                        },
                        error: function (error) {
                            console.error("Error: " + error.code + " " + error.message);
                        }
                    });
                }
            });
        });


})
();