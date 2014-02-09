// Publish Schools that have been signed up
Meteor.publish('schools', function () {
    return schools.find({}, {'fields' : {
        'api_key' : false,
        'api_user' : false,
        'api_endpoint' : false,
        'payment' : false,
        'application' : false
    }})
});

Meteor.publish('applications', function (ward_id) {
    return applications.find({'parentId' : this.userId,
                              'wardId' : ward_id})
});

Meteor.publish('wards', function () {
    return wards.find({'parentId' : this.userId})
});

Meteor.publish('profiles', function () {
    return profiles.find()
});
