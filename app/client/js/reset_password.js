Template.reset_password.rendered = function(){
	$(document).foundation()
	var self = this
	if(!self._abide_hooks){
		$('#reset_password')
		.on('invalid', function (evt) {
			self.reset_password_validated = false
			evt.preventDefault()
		})
		.on('valid', function (evt) {
			self.reset_password_validated = true
			evt.preventDefault()
		});
		self._abide_hooks = true
	}
}

Template.reset_password.events({
	'valid' : function(){
		console.log(arguments)
	},

	'submit #reset_password' : function(evt, obj){
		console.log(arguments)
		evt.preventDefault()

		$('.button[name="enroll-submit"]').blur()
		$('.server-message')
			.removeClass('server-error')
			.removeClass('server-success')
			.hide()

		if(obj.reset_password_validated){

			var password = evt.target[0].value
			var token = Router.getData()['token']
			Accounts.resetPassword(token, password,
				function(err){
					console.log(err)
					if(err){
						$('.server-message')
							.addClass('server-error')
							.text(err.reason).show().focus();

						$('#reset_password input')
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