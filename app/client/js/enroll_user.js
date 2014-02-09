Template.enroll_user.rendered = function(){
	$(document).foundation()
	var self = this
	if(!self._abide_hooks){
		$('#enroll_user')
		.on('invalid', function (evt) {
			self.enroll_user_validated = false
			evt.preventDefault()
		})
		.on('valid', function (evt) {
			self.enroll_user_validated = true
			evt.preventDefault()
		});
		self._abide_hooks = true
	}
}

Template.enroll_user.events({
	'valid' : function(){
		console.log(arguments)
	},

	'submit #enroll_user' : function(evt, obj){
		console.log(arguments)
		evt.preventDefault()

		$('.button[name="enroll-submit"]').blur()
		$('.server-message')
			.removeClass('server-error')
			.removeClass('server-success')
			.hide()

		if(obj.enroll_user_validated){

			var password = evt.target[0].value
			var token = Router.getData()['token']
			Accounts.resetPassword(token, password,
				function(err){

					if(err){
						$('.server-message')
							.addClass('server-error')
							.text(err.reason).show().focus();

						$('#enroll_user input')
							.attr('disabled', true)

					}
					else{
						Router.go('home')
					}
				}
			)

		}

	}
})