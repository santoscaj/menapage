<template lang="pug">
  .main-div
    .login-box( @keyup="checkEnter")
      .credentials
        p Username:
        input.user-password( v-model="username")
        p Password:
        input.user-password( type="password" v-model="password")
        .submit
          Button.login-btn(type="primary" @click="login()")
            p Login
</template>

<script>
// @ is an alias to /src
import ManageTable from '@/components/ManageTable.vue'
import {Vue, Component} from 'vue-property-decorator'
import {Message} from 'view-design'
import axios from 'axios'
// import {checkCredentials} from '@/utils/internal.ts'
import store from '@/store'

@Component({components:{ManageTable}})
export default class ManagePage extends Vue {
  username=''
  password=''
  users = []

  checkEnter(e){
    if(e.keyCode==13)
      this.login()
  }

  async checkCredentials(username, password){
    try{
        let response = await axios.post('login', {username, password})

        let user  = response.data.user
        return user      
      }catch(e){
        if(e.response && (e.response.status == 401 || e.response.status == 404))
          Message.error('Please check username and password')
        else
          Message.error('couldnt login')
        console.error('status',e.response.status)
        return null
    }
  }


  login(){
    if(!this.username) return Message.error('No username provided')
    if(!this.password) return Message.error('No password provided')
    
    let user = checkCredentials(this.username, this.password, this.users)

    if(!user)
      return Message.error('Wrong username or password')
    
    store.setUser(user)
    if(user.id)
      this.$router.push({name:'ManageHome'})
  }

  async mounted(){
  try{
    let response = await axios.get('users')
    this.users = response.data
  }catch(err){console.error(err)}
    // try{
    //   let response = await axios.get(`http://localhost:3000/album_of_the_day/0`)
    //   this.backgroundFotos = response.data
    // }catch(err){console.error(err)}
  }

}



</script>

<style lang="sass" scoped>
*
  font-family: 'Open Sans', 'Comic Neue' cursive

.main-div
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%

.login-box
  width: 300px

.user-password, .user-password:focus
  width: 100%
  outline: none
  border: 1px solid lightgray
  font-family: 'Open Sans', 'Comic Neue' cursive
  padding: 3px 5px
  border-radius: 5px
  &:hover
    outline: none
    border: 1px solid black
  
.login-btn
  background: orange
  padding: 5px
  border: 1px solid gray
  border-radius: 5px

.credentials
  display: flex
  flex-direction: column
  border: 1px solid black
  padding: 20px 30px
  border-radius: 5px
  background: rgb(255,255,255,0.1)
  margin-bottom: 150px
  &>p
    font-weight: 700
    font-size: 14px
  &>*
    margin: 2px

.submit
  margin-top: 15px

</style>


