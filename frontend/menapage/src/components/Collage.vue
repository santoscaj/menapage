<template lang="pug">
div
  .picture 
    img
  .picture 
    img
  .picture 
    img
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Collage extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

.picture
  width: 300px
  height: 200px
  border: 1px solid red

</style>
