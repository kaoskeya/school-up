process.env.MAIL_URL = "<insert smpt url here";

var Stripe = StripeAPI('<stripe api here>');

var test_users = [

    {
        name:"Parent1",
        email:"p1@sup.com",
        roles:['parent']
    },


    {
        name:"Parent2",
        email:"p2@sup.com",
        roles:['parent']
    },


    {
        name:"Parent3",
        email:"p3@sup.com",
        roles:['parent']
    },

    {
        name:"SchoolMe1 High School",
        email:"s1sup.com",
        roles:['school-admin']
    },

    {
        name:"SchoolMe2 High School",
        email:"s2sup.com",
        roles:['school-admin']
    },

    {
        name:"SchoolMe3 High School",
        email:"s3sup.com",
        roles:['school-admin']
    },

    {
        name:"SchoolMe4 High School",
        email:"s4sup.com",
        roles:['school-admin']
    },

    {
        name:"SchoolMe5 High School",
        email:"s5sup.com",
        roles:['school-admin']
    },

    {
        name:"SchoolMe6 High School",
        email:"s6sup.com",
        roles:['school-admin']
    }




];

_.each(test_users, function (user) {

    try{
        var id = Accounts.createUser({
            email: user.email,
            password: "test123",
            profile: { name: user.name }
        });
    }
    catch(err){
        console.log(err)
    }

    if (id && user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
    }

});


