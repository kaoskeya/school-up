// Collection subscriptions

Meteor.autorun(function(){
    // Re subscribe on user change
    var userId = Meteor.userId();
    var ward_id  = Session.get("selected_ward");

    console.log("Running again");
    Meteor.subscribe("schools");
    Meteor.subscribe("wards");
    Meteor.subscribe("applications", ward_id);
    Meteor.subscribe("profile");
})
