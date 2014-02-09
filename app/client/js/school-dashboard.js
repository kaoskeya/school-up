Template.school_dashboard.rendered = function(){
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

Template.school_dashboard.events({
    'submit #create_account' : function(evt, obj){
        evt.preventDefault()


        $('.button[name="create-submit"]').blur()
        $('#create_account_panel .server-message')
            .removeClass('server-error')
            .removeClass('server-success')
            .hide()

        if(obj.create_account_validated){

            var sname = evt.target[0].value
            var cost = evt.target[1].value
            var api_user = evt.target[2].value
            var api_key = evt.target[3].value
            var api_endpoint = evt.target[4].value

            var settings = {
                'school_name' : sname,
                'application_cost' : cost,
                'api_user' : api_user,
                'api_key' : api_key,
                'api_endpoint' : api_endpoint
            }

            NProgress.start()
            Meteor.call('update_school_settings', settings,
                function(err, data){
                    NProgress.done()
                    if(err){
                        $('.server-message')
                            .addClass('server-error')
                            .text(err.reason).show().focus();
                    }
                    else{
                        $('.button[name="create-submit"]')
                            .val("Account Created")

                        $('#create_account input')
                            .attr('disabled', true)

                        $('.server-message')
                            .addClass('server-success')
                            .text(data.message).show().focus();

                    }

            })
        }
        else
        {
            $('.server-message')
                .addClass('server-error')
                .text('Errors were found in the form').show().focus()
        }

    }
})