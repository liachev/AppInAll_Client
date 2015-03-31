angular.module('appinall.models.users', ['parse-angular.enhance'])

.run(function() {
	// --------------------------
	// User Object Definition
	// --------------------------

	// Under the hood, everytime you fetch a User object from Parse,
	// the SDK will natively use this extended class, so you don't have to
	// worry about objects instantiation if you fetch them from a Parse query for instance
	var User = Parse.Object.extend({
		className: "_User", // TODO: must be changed later
		// Extend the object with getter and setters
		attrs: [
			"username",
			"firstName",
			"lastName",
			"authData",
			"emailVerified",
			"email",
			"password",
			"agreedDateTerms",
			"agreedDatePrivacy"
		]
	});

	// --------------------------
	// User Collection Definition
	// --------------------------
	var Users = Parse.Collection.extend({
		model: User,

		// We give a className to be able to retrieve the collection
		// from the getClass helper.
		className: "_User", // TODO: must be changed later

		comparator: function(model) {
			return model.getEmail(); // TODO: must be change later
		},

		loadUsersWithEmail: function(email) {
			this.query = (new Parse.Query(User));
			this.query.equalTo('email', email);
			// use the enhanced load() function to fetch the collection
		    var result = this.query.find({
                success: function(results) {
                },
                error: function(error) {
                    console.error("Error: " + error.code + " " + error.message);
                }
            });
			return result;
		},

		addUser: function(signupData) {
	 		// save request_id to Parse
	 		var _this = this;

			var user = fetchUserData(signupData);

			// perform a save and return the promised object back into the Angular world
			return user.save().then(function(object){
				// here object === user basically
				_this.add(object);
				return object;
			})
	 	},

	 	removeUser:function(user) {
	 		if (!this.get(user))
	 		    return false;

	 		var _this = this;
	 		return user.destroy().then(function(){
	 			_this.remove(user);
	 		});
	 	},

	 	fetchUserData: function(data) {
	 		var username = ((data.firstName && data.lastName) != undefined)
	 			? (data.firstName + " " + data.lastName)
	 			: data.username;

			var user = new User;
			user.set("firstName", data.firstName);
			user.set("lastName", data.lastName);
			user.set("email", data.email);
			user.set("password", data.password);
			user.set("username", username);
			user.set("authData", data.authData);
            user.set("agreedDateTerms", data.dateTerms);
            user.set("agreedDatePrivacy", data.datePrivacy);

            return user;
	 	}
	});
});