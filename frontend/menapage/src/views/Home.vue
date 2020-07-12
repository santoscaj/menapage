<template lang="pug">
    Collage
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Component from 'vue-class-component'
import Collage from '@/components/Collage.vue'
import store from '@/store'

@Component({
  components: {
    Collage
    }
  })
export default class Home extends Vue {
  get user(){
    return store.user
  }
}
</script>


<style scoped lang="sass">

</style>