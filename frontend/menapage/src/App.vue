<template lang="pug">
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '@/store'

@Component({})
export default class App extends Vue {

  beforeCreate(){
    let user = localStorage.getItem('user')

    if(user)
      store.setUser(JSON.parse(user))
  }
}
</script>

<style lang="sass">
html, body
  width: 100%
  height: 100%
  margin: 0
  box-sizing: border-box

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px

</style>
