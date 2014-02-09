selected_schools = new Meteor.Collection(null)

Template.parents_dashboard.rendered = function(){
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


Template.parents_dashboard.helpers({
    'hide_add_ward' : function(){
        return _.isEmpty(wards.findOne()) ? '' : 'hide'
    },

    'selected_ward' : function(){
        return wards.findOne({'_id' : Session.get('selected_ward')});
    },

    'wards' : function(){
        return wards.find()
    },

    'schools' : function(){
        return schools.find()
    },

    'applications' : function(){
        var ward_id = Session.get("selected_ward")
        var parent_id = Meteor.userId()

        return applications.find({})
    }

})

Template.parents_dashboard.events({
    'click .ward' : function(evt, ui){
        console.log(this)
        console.log(evt, ui)
        Session.set("selected_ward", this._id)
        $('#add_ward_section').slideUp()

    },

    'click #add_ward_option' : function(evt, ui){
        $('#add_ward_section').slideDown()
        Session.set("selected_ward", "")

    },

    'submit #create_account' : function(evt, obj){
        evt.preventDefault()
        console.log(evt.target)

        $('.button[name="create-submit"]').blur()
        $('#create_account_panel .server-message')
            .removeClass('server-error')
            .removeClass('server-success')
            .hide()

        if(obj.create_account_validated){

            var data = {} 
            data['name'] = evt.target[0].value
            data['dob'] = evt.target[1].value
            data['gender'] = evt.target[2].value

            data['placeofbirth'] = evt.target[3].value
            data['religion'] = evt.target[4].value

            data['parent_one_email'] = evt.target[5].value
            data['parent_one_name'] = evt.target[6].value
            data['parent_one_phone'] = evt.target[7].value

            data['parent_two_email'] = evt.target[8].value
            data['parent_two_name'] = evt.target[9].value
            data['parent_two_phone'] = evt.target[10].value


            NProgress.start()
            Meteor.call('add_ward', data,
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

                        // $('#create_account input')
                        //     .attr('disabled', true)

                        $('#create_account_panel .server-message')
                            .addClass('server-success')
                            .text(data.message).show().focus();

                    }

            })
            $('#add_ward_section').slideUp()
        }
        else
        {
            $('#create_account_panel .server-message')
                .addClass('server-error')
                .text('Errors were found in the form').show().focus()
        }

    },


    'click .cta-button' : function(evt, ui){
        console.log(evt, ui)
        var id = '#' + this._id

        this['ward_id'] = Session.get('selected_ward');

        if($(id).text() === 'Select'){
           $(id).text("Unselect") 
            selected_schools.insert(this) 
        }
        else {
           $(id).text("Select") 
            selected_schools.remove({'_id' : this._id})             
        }


        $(id).toggleClass('success')



    },

    'click .app_submit' : function(evt, ui){
        evt.preventDefault()
        console.log(evt, ui, this)
        Meteor.call("submit_application", this, function(err, data){
            console.log(data, err)
        })

    }




})