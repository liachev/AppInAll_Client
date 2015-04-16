angular.module('appinall.models.profiles', ['parse-angular.enhance'])

.run(function() {
	// --------------------------
	// Profile Object Definition
	// --------------------------

	// Under the hood, everytime you fetch a Profile object from Parse,
	// the SDK will natively use this extended class, so you don't have to
	// worry about objects instantiation if you fetch them from a Parse query for instance
	var Profile = Parse.Object.extend({
		className: "Profile", // TODO: must be changed later
		// Extend the object with getter and setters
		attrs: [
			"firstName",
			"lastName",
			"avatar",
			"location",
			"gender",
			"birthday",
			"kid",
			"interestedIn",
			"user"
		]
	});

	// --------------------------
	// Profile Collection Definition
	// --------------------------
	var Profiles = Parse.Collection.extend({
		model: Profile,

		// We give a className to be able to retrieve the collection
		// from the getClass helper.
		className: "Profile", // TODO: must be changed later

		comparator: function(model) {
			return (model.getLastName() + model.getFirstName()); // TODO: must be change later
		},

		createProfile: function() {
			return new Profile;
		},

		getProfilesByUser: function(user) {
			var query = new Parse.Query(Profile);
            query.equalTo("user", user);
            var result = query.find({
              success: function(profile) {
                // do smth with profile
              }
            });
			return result;
		},

		addProfile: function(profileData) {
	 		// save request_id to Parse
	 		var _this = this;

			return _this.fetchProfileData(profileData).then(function (profile) {
				// perform a save and return the promised object back into the Angular world
				return profile.save().then(function(object){
					// here object === profile basically
					_this.add(object);
					return object;
				})
			});
	 	},

	 	removeProfile:function(profile) {
	 		if (!this.get(profile))
	 		    return false;

	 		var _this = this;
	 		return profile.destroy().then(function(){
	 			_this.remove(profile);
	 		});
	 	},

	 	fetchProfileData: function(data) {
			var query = new Parse.Query(Profile);
			return query.get(data.id, {
				success: function (profile) {
					return profile;
				},
				error: function (object, error) {
					// TODO: an error occurs, log it; or data doesn't created yet
				}
			}).then(function (profile) {
				return profile;
			}, function (error) {
				// error handler
				return Parse.Promise.as(new Profile);
			}).then(function (profile) {
				profile.set("firstName", data.firstName);
				profile.set("lastName", data.lastName);
				profile.set("avatar", data.avatar);
				profile.set("location", data.location);
				profile.set("gender", data.gender);
				profile.set("birthday", data.birthday);
				profile.set("kid", data.kid);
				profile.set("interestedIn", data.interestedIn);
				// TODO: complete this if new columns added to `Profile`
				return profile;
			});
	 	}
	});
});