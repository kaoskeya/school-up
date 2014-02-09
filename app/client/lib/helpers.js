ranked_roles = ['registered', 'admin']

_get_optimistic_role = function(userId){
    // Get Role of the current user
    var roles = Roles.getRolesForUser(userId)
    var role = _.sortBy(roles,
                        function(x){return -_.indexOf(ranked_roles, x)})[0]
    return role && role || 'public'
}