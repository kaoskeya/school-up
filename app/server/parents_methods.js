Meteor.methods({
    'add_ward' : function(data){
        data['parentId'] = this.userId
        wards.insert(data)
        return {
            'message' : 'Ward added successfully'
        }
    },

    'submit_application' : function(data){

        var ward = wards.findOne({
            '_id' : data['wardId']
        })


        var school = schools.findOne({'_id' : data['schoolId']})

        delete ward['_id']


        var url = _url.resolve(school['api_endpoint'], school['application']['list_endpoint'])
        url += "?api_key=" + school['api_key'] + "&username=" + school['api_user']

        ward['payment'] = _url.resolve(school['application']['list_endpoint'],
                                        data['remoteInvoiceId'].toString()) + '/'
        try{

            var confirmation = HTTP.post(url, {data : ward})
        }
        catch(e){
            throw Meteor.Error(500, "Something went wrong")
            console.log(e)
        }


        applications.update({"_id" : data['_id']}, {$set : {'status' : 'DONE'}})




    }


})