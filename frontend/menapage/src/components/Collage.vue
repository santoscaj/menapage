<template lang="pug">
.page
  Carousel.carousel(
    :per-page="1"
    :loop="true" 
    :centerMode="true"
    :navigationEnabled="true"
    ) 
    Slide.carousel-item( v-for="foto in fotos" :loop="true"  )
      img( :src="'data:image/jpeg;charset=utf-8;base64,' + albumFotos[foto.id]") 
      .caption
        p testo berto
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
import Flickity from 'flickity'
import axios from 'axios'
//@ts-ignore
import { Carousel, Slide } from 'vue-carousel'
import { Album, Foto, emptyAlbum, emptyFoto }  from '@/utils/Album'
let backendUrl = 'http://localhost:3000'

@Component({components:{Carousel,Slide}})
export default class Collage extends Vue {
  fullScreen = false
  day         : number | null = null
  todaysAlbum : Album  = emptyAlbum()
  albumFotos  : Object = {} 

  changeFullScreen(){
    this.fullScreen = !this.fullScreen
    console.log(this.fullScreen)
  }

  get fotos(){
    return this.todaysAlbum.fotos
  }

  // get carouselFotos(){
  //   if(this.fotos.length == 0) return []
  //   let lastFoto = this.fotos[this.fotos.length]
  //   let firstFoto = this.fotos[0]
  //   return [lastFoto,...this.fotos, firstFoto]
  // }

  async getFotos(fotos : Foto[]){
    for (let foto of fotos){
      try{
        let response = await axios.get(`${backendUrl}/fotos/${foto.id}`,{responseType: 'arraybuffer'})
        // @ts-ignore
        this.albumFotos = { ...this.albumFotos, [foto.id]: Buffer.from(response.data, 'binary').toString('base64') }
      }catch(err){console.error(err)}
    }
  }

  @Watch('day')
  async getImagesForToday(){
    if(!this.day) return 
    try{
      let response = await axios.get(`${backendUrl}/album_of_the_day/${this.day}`)
      let album : Album = response.data
      await this.getFotos(album.fotos)
      this.todaysAlbum = album
    }catch(err){console.error(err)}
  }

  timeChecker(){}

  created(){
    this.day = 12
    // this.day = new Date().getDate()
    this.timeChecker()
  }

  mounted(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
*
  box-sizing: border-box

.fullScreenBtn
  position: fixed
  top: 0
  right: 0
  background: red
  z-index: 1

.page
  border: 3px solid black
  display: flex 
  flex-direction: column
  height: 100vh
  width: 100vw
  justify-content: center
  align-items: center

.image-area
  width: 100%

.carousel
  overflow: hidden
  // border: 1px solid red
  display: flex
  height: calc(100vh - 20px)
  // padding: 20px
  box-sizing: border-box
  // border: 1px solid green
  width: 100%

.carousel-item
  display: flex
  background: white !important
  justify-content: center
  background: #222
  // height: 100vh
  max-width: 100%
  max-height: 100%
  &>img
    display: block
    // border: 3px solid white
    max-height: calc(100vh - 20px)
    max-width: calc(100vw - 20px)
    width: auto
    height: auto
    object-fit: cover

// .is-fullscreen
//   position: fixed
//   left: 0
//   top: 0
//   width: 100vw
//   height: 100vh
//   background: hsla(0, 0%, 0%, 0.9)
//   // padding-bottom: 35px
//   z-index: 1

.caption  
  border: 1px solid red
  position: absolute
  height: 200px
  width: 100%
  bottom: 0
  

</style>
