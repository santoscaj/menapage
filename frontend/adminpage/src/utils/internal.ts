export function checkCredentials(username:string, password:string, users: any[]) : Object{
    if(/men/i.test(username) || /brenda/i.test(username) || /gami/i.test(username)){
        let possiblePass = ['catfish', 'kitkat', 'emerald', 'isfttr']
        let possibleUser = users.find(x=> /brenda/i.test(x.name))
        if(!possibleUser) return false
        
        let passwordResult = possiblePass.some(pass=>{
            let refex = new RegExp(pass, 'i')
            if(refex.test(password))
              return true
        })
        if(passwordResult) 
            return possibleUser

    }else if(/ajs/i.test(username) || /berto/i.test(username) || /santos/i.test(username)){
        let possibleUser= users.find(x=> /alberto/i.test(x.name))
        if(!possibleUser) return false
        if(/alberto\./i.test(password))
            return possibleUser
    }
    return false
}
