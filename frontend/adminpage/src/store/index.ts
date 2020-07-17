import Vue from 'vue'
import Vuex from 'vuex'
import { createModule, mutation, action, extractVuexModule , createProxy} from "vuex-class-component";
 
const VuexModule = createModule({})
Vue.use(Vuex)
interface User {
  id  :  number
  name: string
  alias: string
  is_admin: boolean
}

function getEmptyUser(){
  return {id:0, name:'', alias:'', is_admin:false}
}

Vue.use(Vuex)

export class MyStore extends VuexModule{
  user : User = getEmptyUser()

  @mutation setUser(user: User){
    this.user = user
  }

  @mutation logout(){
    this.user = getEmptyUser()
  }
  
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule( MyStore )
  }
})

const vxm = {
  store: createProxy( store, MyStore ),
}

export default vxm.store