<template lang="pug">
  .main-div
    .login-box
      .credentials
        p Username:
        Input(label="username" v-model="username")
        p Password:
        Input(label="password" v-model="password")
        .submit
          Button(type="primary" @click="login()")
            p Login
</template>

<script>
// @ is an alias to /src
import ManageTable from '@/components/ManageTable.vue'
import {Vue, Component} from 'vue-property-decorator'
import {Message} from 'view-design'
@Component({components:{ManageTable}})
export default class ManagePage extends Vue {
  username=''
  password=''

  adminUser = 'admin'
  adminPass = 'adminadmin'

  // For this project I will be the only user to ever this page.
  // No need to construct DB or perform requests to the backend
  login(){
    if(!this.username) return Message.error('No username provided')
    if(!this.password) return Message.error('No password provided')
    
    if(this.username!=this.adminUser || this.password !=this.adminPass)
      return Message.error('Wrong username or password')
    
    this.$store.commit('login')
    Message.success('login successful')
    this.$router.push({name:'Manage'})
  }

}



</script>

<style lang="sass" scoped>
.main-div
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%

.login-box
  width: 25vw

.credentials
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


