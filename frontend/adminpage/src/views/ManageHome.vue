<template lang="pug">
  .main-div
    .container
      h2 Please select album
      .grid 
        .album( v-for="album in albums" :key="album.id" @click="goToManagePage(album.day)") 
          div day {{album.day}}
          div {{album.dirname}} 
          div ({{album.fotos.length}})
</template>

<script>
// @ is an alias to /src
import {Vue, Component} from 'vue-property-decorator'
import axios from 'axios'
import store from '@/store'

@Component({components:{}})
export default class ManageHome extends Vue {

albums = []

goToManagePage(albumDay){
  this.$router.push({name:'Manage', params:{albumDay}})
}

async created(){

  try{
    let response = await axios.get('albums')
    this.albums = response.data
  }catch(e){console.error(e)}
}

}
</script>


<style lang="sass" scoped>


.main-div
  width: 100vw
  height: 100vh
  display: flex
  flex-direction: column

  box-sizing: border-box

.container
  flex: 1 1 auto
  padding: 50px
  &>h2
    padding: 10px

.grid
  box-sizing: border-box
  padding: 50px
  height: 500px
  border: 3px solid lightblue
  border-radius: 10px
  width: 100%
  height: auto
  display: grid
  grid-template-columns: repeat(auto-fill , 150px)
  grid-gap: 10px
  // grid-template-rows: repeat(auto-fill , 150px)

.album
  width: 150px
  height: 150px
  padding: 5px 
  border: 2px solid orange
  border-radius: 10px
  background: darkcyan
  color: white
  display: flex
  justify-content: center
  flex-direction: column
  align-items: center
  transition: all 0.2s ease
  &>*
    text-align: center
  &:hover
    background: white
    color: black
    font-weight: 500
    font-size: 15px

</style>