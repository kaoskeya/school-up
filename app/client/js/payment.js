var stripe_pkey = '<stripe public key here>';


Template.payment.events({
    'click button': function(e) {
        e.preventDefault();
        var user = Meteor.user()
        var cur = selected_schools.find()
        var schools = cur.fetch()
        var amount = _.reduce(schools, function(total, x){
            return +x['application_cost'] + total
        }, 0)

        console.log(amount, cur.count())

        StripeCheckout.open({
            key: stripe_pkey,
            amount: amount * 100,
            // image: "",
            name: 'SchoolUp',
            email : user['emails'][0]['address'],
            description: cur.count() + ' School Applications ($' + amount + ')',
            panelLabel: 'Pay Now',
            token: function(res) {
                console.info(res);
                res['_sup_parentId'] = user._id;
                res['_sup_wardId'] = Session.get("selected_ward");
                Meteor.call("charge_customer", res, schools, function(err, data){
                    console.log(data)
                })
            }
        });
    }
});