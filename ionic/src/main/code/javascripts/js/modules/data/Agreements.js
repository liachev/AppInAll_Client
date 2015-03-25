angular.module('appinall.models.agreements', ['parse-angular.enhance'])

.run(function(){
    var Agreement = Parse.Object.extend({
        className: "Agreement",
        attrs: ['title', 'text']
    });

    var Agreements = Parse.Collection.extend({
        model: Agreement,

        // We give a className to be able to retrieve the collection
        // from the getClass helper.
        className: "Agreement",

        comparator: function(model) {
            return model.getTitle(); // TODO: must be change later
        },

        loadAgreementsWithTitle: function(title) {
            this.query = (new Parse.Query(Agreement));
            this.query.equalTo('title', title);
            // use the enhanced load() function to fetch the collection
            var result = this.query.find({
                success: function(results) {
                    console.debug("[Agreement.loadAgreementsWithTitle] " + JSON.stringify(results));
                },
                error: function(error) {
                    console.error("Error: " + error.code + " " + error.message);
                }
            });
            return result;
        },

        addAgreement: function(title, text) {
            // save request_id to Parse
            var _this = this;

            var agreement = new Agreement;
            agreement.setTitle(title);
            agreement.setText(text);

            // perform a save and return the promised object back into the Angular world
            return agreement.save().then(function(object){
                // here object === user basically
                _this.add(object);
                return object;
            })
        },

        removeAgreement:function(agreement) {
            if (!this.get(agreement))
                return false;

            var _this = this;
            return agreement.destroy().then(function(){
                _this.remove(agreement);
            });
        }
    });
});