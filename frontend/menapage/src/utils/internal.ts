
// This is a samlpe function to filter the users and passwords before allowing login
export function checkCredentials(username:string, password:string, users: any[]) : Object{
    if(/visit/i.test(username) || /test/i.test(username)  || /guest/i.test(username)){
        let possibleUser = users.find(x=> /brenda/i.test(x.name))
        if(!possibleUser) return false
        if (password==username)
	    return possibleUser

    }
    return false
}
