_url = Npm.require('url')

_type_map = {
    'string' : 'text',
    'integer' : 'number',
    'datetime' : 'date'
}


Meteor.methods({
    'update_school_settings' : function(data){

        var userId = this.userId ? this.userId : 'global'


        data['userId'] = userId;

        data['api_endpoint'] = (_.last(data['api_endpoint']) == '/' ?
                                 data['api_endpoint'].slice(0, -1) : data['api_endpoint'])

        console.log(data)
        this.unblock();
        try {
            var result = HTTP.call("GET", data['api_endpoint']);
        } 
        catch (e) {
            console.log(e)
            throw new Meteor.Error("500", "Error while accessing end point")
        }

        data['payment'] = result['data']['payment']
        data['application'] = result['data']['application']

        var url = _url.resolve(data['api_endpoint'], data['application']['schema'])
        console.log("URL", url, data)

        try{

            var result = HTTP.call("GET", url,
                {params: {username : data['api_user'],
                          api_key : data['api_key']}});
        }
        catch(e){
            console.log(e)
            throw new Meteor.Error("500", "Error while accessing schema")
        }

        var fields = []
        _.each(result['data']['fields'], function(v,k){
            if(!_.contains(['id', 'resource_uri'], k))
                fields.push({
                    'name' : k,
                    'type' : v['type'],
                    'form_type' : _type_map[v['type']]
                })
        })
        data['fields'] = fields
        schools.upsert({'_id' : userId}, {$set : data})

        return {
            'message' : "Successfully Updated School Settings"
        }
    }

})


var _data = {'api_key' : 'e03fe759e05378cd5939ca24e411a0c1f0cdbacb',
        'api_user' : 'deepu',
        'api_endpoint' : 'http://localhost:8000/api/v1',
        'school_name' : 'CHS',
        'application_cost' : 500}

// Meteor.call('update_school_settings', _data, function (err, result) {
//     console.log(err, result)
// });