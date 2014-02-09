var Stripe = StripeAPI('<stripe key here>');


Meteor.methods({
    'charge_customer' : function(data, selected_schools){
        console.log(data)

        var _schools = []

        _.each(selected_schools, function(x){
            _schools.push(schools.findOne({'_id' : x._id}))
        })

        var amount = _.reduce(selected_schools, function(total, x){
            return +x['application_cost'] + total
        }, 0)

        var userId = this.userId;
        var token = data.id;
        var user = Meteor.user()

        console.log(amount)

        if(!userId || data['_sup_parentId'] != userId){
            throw new Meteor.Error(401, "Unauthorized")
        }



        var fn = Meteor.bindEnvironment(function(err, result) {
                console.log("Here")
                if(err){
                    console.log(err)
                    return {"error" : err}
                }


                console.log(result)
                result['token_data'] = data
                result['parentId'] = data['_sup_parentId']
                result['wardId'] = data['_sup_wardId']


                _.each(_schools, function(x){ 

                    var url = _url.resolve(x['api_endpoint'], x['payment']['list_endpoint'])
                    url += "?api_key=" + x['api_key'] + "&username=" + x['api_user']
                    console.log("URL", url, x)

                    console.log(url, {params: {info : result.id,
                                mode : "ONLINE",
                                amount : amount,
                                name : user.profile.name,
                                api_key : x['api_key'],
                                username : x['api_user']
                            }})


                    try{
                        var confirmation = HTTP.post(url, {data: {info : result.id,
                                mode : "ONLINE",
                                amount : amount,
                                name : user.profile.name
                            }})
                    }
                    catch(e){
                        console.log(e)
                        return
                    }


                    var remoteId = confirmation['data']['id']
                    var pid = payments.insert(result)


                    applications.insert({
                        'parentId' : data['_sup_parentId'],
                        'wardId' : data['_sup_wardId'],
                        'status' : 'paid',
                        'schoolId' : x['_id'],
                        'remoteInvoiceId' : remoteId,
                        'invoiceId' : pid,
                        'schoolName' : x['school_name']
                    })
                })





                return result
            }, function(e){
                console.log(e)
            })


        var result = Meteor._wrapAsync(function(){
            Stripe.charges.create({
              amount: amount * 100, // amount in cents, again
              currency: "usd",
              card: token
            }, fn)
        })()

    }
})