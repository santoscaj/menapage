<template lang="pug">
  router-view
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import store from '@/store'

@Component({})
export default class App extends Vue {

}
</script>

<style lang="sass">

html, body
  height: 100%

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
  heigth: 100%
  
</style>
