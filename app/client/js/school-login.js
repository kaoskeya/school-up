Template.school_login.rendered = function(){
    $(document).foundation()
    var self = this
    if(!self._abide_hooks){
        $('#create_account')
        .on('invalid', function (evt) {
            self.create_account_validated = false
            evt.preventDefault()
        })
        .on('valid', function (evt) {
            self.create_account_validated = true
            evt.preventDefault()
        });

        self._abide_hooks = true
    }

}

Template.school_login.events({
    'submit #create_account' : function(evt, obj){
        evt.preventDefault()


        $('.button[name="create-submit"]').blur()
        $('#create_account_panel .server-message')
            .removeClass('server-error')
            .removeClass('server-success')
            .hide()

        if(obj.create_account_validated){

            var fname = evt.target[0].value
            var lname = evt.target[1].value
            var org = evt.target[2].value
            var email = evt.target[3].value
            var username = email

            var profile = {
                'first_name' : fname,
                'last_name' : lname,
                'organization' : org,
            }

            NProgress.start()
            Meteor.call('enrollSchool', username, email, profile,
                function(err, data){
                    NProgress.done()
                    if(err){
                        $('#create_account_panel .server-message')
                            .addClass('server-error')
                            .text(err.reason).show().focus();
                    }
                    else{
                        $('.button[name="create-submit"]')
                            .val("Account Created")

                        $('#create_account input')
                            .attr('disabled', true)

                        $('#create_account_panel .server-message')
                            .addClass('server-success')
                            .text(data.message).show().focus();

                    }

            })
        }
        else
        {
            $('#create_account_panel .server-message')
                .addClass('server-error')
                .text('Errors were found in the form').show().focus()
        }

    },

    'submit #sign-in' : function(evt, obj){
        console.log(arguments)
        evt.preventDefault()

        var email = evt.target[0].value
        var password = evt.target[1].value

        var err = ""
        if(!email)
            err = "Email ID required"
        else if(!password)
            err = "Password required"

        if(err){
            $('#login_panel .server-message')
                .addClass('server-error')
                .text(err).show().focus();
            return
        }



        $('.button[name="login-submit"]').blur()
        $('#login_panel .server-message')
            .removeClass('server-error')
            .removeClass('server-success')
            .hide()

        NProgress.start()
        Meteor.loginWithPassword(email, password,
            function(err){
                NProgress.done()
                if(err){
                    $('#login_panel .server-message')
                        .addClass('server-error')
                        .text(err.reason).show().focus();
                }
                else
                    Router.go('home')
            })
    },

    'click #forgot_password_button' : function(){
        $('#login_panel').slideUp(function(){
            $('#forgot_panel').slideDown()
        })
    },

    'click #back_button' : function(){
        $('#forgot_panel').slideUp(function(){
            $('#login_panel').slideDown()
        })
    },

    'submit #forgot_password' : function(evt, obj){
        console.log(arguments)
        evt.preventDefault()

        var email = evt.target[0].value

        var err = ""
        if(!email)
            err = "Email ID required"

        if(err){
            $('#forgot_panel .server-message')
                .addClass('server-error')
                .text(err).show().focus();
            return
        }


        $('.button[name="forgot-submit"]').blur()
        $('#forgot_panel .server-message')
            .removeClass('server-error')
            .removeClass('server-success')
            .hide()

        NProgress.start()
        Meteor.call('sendResetPasswordEmail', email,
            function(err, data){
                NProgress.done()
                if(err){
                    $('#forgot_panel .server-message')
                        .addClass('server-error')
                        .text(err.reason).show().focus();
                }
                else{
                    $('#forgot_password input')
                        .attr('disabled', true)

                    $('#forgot_panel .server-message')
                        .addClass('server-success')
                        .text(data.message).show().focus();
                }
            })
    }


})