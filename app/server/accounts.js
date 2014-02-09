Accounts.urls.enrollAccount = function (token) {                                                                 // 13
	return Meteor.absoluteUrl('user/enroll/' + token);                                                        // 14
};

Accounts.urls.resetPassword = function (token) {                                                                 // 13
	return Meteor.absoluteUrl('user/reset-password/' + token);                                                        // 14
};


Accounts.config({
	forbidClientAccountCreation : true
})

Meteor.methods({
	'enrollUser' : function(username, email, profile){
		var userId = Accounts.createUser({
			'username' : username,
			'email' : email,
			'profile' : profile || {}
		});

		Roles.addUsersToRoles(userId, 'registered')

		Meteor.defer(function(){
			Accounts.sendEnrollmentEmail(userId)
		});
		return {
			'message' : 'Login details have been sent to your email address.'
		}
	},

	'enrollSchool' : function(username, email, profile){
		var userId = Accounts.createUser({
			'username' : username,
			'email' : email,
			'profile' : profile || {}
		});

		Roles.addUsersToRoles(userId, 'school-admin')

		Meteor.defer(function(){
			Accounts.sendEnrollmentEmail(userId)
		});
		return {
			'message' : 'Login details have been sent to your email address.'
		}
	},


	'sendResetPasswordEmail' : function(email){

		var user = Meteor.users.findOne({"emails.address": email});
		if (!user)
			throw new Meteor.Error(403, "User not found");

		Meteor.defer(function(){
			Accounts.sendResetPasswordEmail(user._id, email);
		})
		return {
			'message' : ('Details to reset your password have been emailed'
						 + ' to you.')
		}
	}

});