<template lang="pug">
.page
  .main-carousel
    .carousel-cell(v-for="foto in fotos" :class="{'is-fullscreen': fullScreen }" )
      img( :src="'data:image/jpeg;charset=utf-8;base64,' + albumFotos[foto.id]") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img( :src="'data:image/png;base64,' + img") 
    //-   img( :src="'data:image/jpeg;charset=utf-8;base64,' + img") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://eloutput.com/app/uploads-eloutput.com/2020/03/super-mario.jpg") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://m.media-amazon.com/images/M/MV5BNDQ2YjE5OTctODY1NC00ZDgxLTk0YmUtYWExZGE1Njg0ZDRlXkEyXkFqcGdeQXVyNjMxNzQ2NTQ@._V1_UY1200_CR285,0,630,1200_AL_.jpg") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://cdn.custom-cursor.com/collections/pokemon.png") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://i.pinimg.com/474x/51/1a/04/511a0449d434c1d6f1e72155f15da67c.jpg") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://cdn.vox-cdn.com/thumbor/Q6cr4ujTzXuv3NhRUIDkgZHxDdo=/0x0:2048x2048/920x613/filters:focal(861x861:1187x1187):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65327601/mobile_MarioKartTour_screen_07_png_jpgcopy.0.jpg") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://lh3.googleusercontent.com/jd_ZEZPrw1cb9jhh4ahq2AQmatyHooba15lDPyCTmne9Pffoy6yLaYxKpjcXGLPBi40") 
    //- .carousel-cell( :class="{'is-fullscreen': fullScreen }" )
    //-   img(src="https://www.videogameschronicle.com/files/2019/09/EEZSr_nUEAA8DUC-1024x1024.jpg") 
  //- button.fullScreenBtn(@click="changeFullScreen()") fullscreen
  //- .message-area
  //-   button Message Berts
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
import Flickity from 'flickity'
import axios from 'axios'
import { Album, Foto, emptyAlbum, emptyFoto }  from '@/utils/Album'
let backendUrl = 'http://localhost:3000'

@Component({})
export default class Collage extends Vue {
  fullScreen = true
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

  async getFotos(fotos : Foto[]){
    for (let foto of fotos){
      try{
        let response = await axios.get(`${backendUrl}/fotos/${foto.id}`,{responseType: 'arraybuffer'})
        // @ts-ignore
        this.albumFotos = { ...this.albumFotos, [foto.id]: Buffer.from(response.data, 'binary').toString('base64') }
      }catch(err){console.error(err)}
    }
    // this.updateCarousel()
  }

  @Watch('day')
  async getImagesForToday(){
    if(!this.day) return 
    try{
      let response = await axios.get(`${backendUrl}/album_of_the_day/${this.day}`)
      let album : Album = response.data
      await this.getFotos(album.fotos)
      this.todaysAlbum = album
      this.updateCarousel()
    }catch(err){console.error(err)}
  }

  timeChecker(){}

  created(){
    this.day = new Date().getDate()
    this.timeChecker()
  }

  updateCarousel(){
    let flkty   = new Flickity('.main-carousel', {
      cellAlign: 'center', 
      wrapAround: true,
    })
    document.querySelectorAll<HTMLElement>('.flickity-page-dots').forEach(element=>{
      element.style.bottom= '10px'
    })
    document.querySelectorAll<HTMLElement>('.flickity-button').forEach( ( element )=>{
      element.style.background  = 'rgb(0,0,0,0.1)'
      element.style.color  = 'white'
    })
  }

  mounted(){
    // this.updateCarousel()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
*
  box-sizing: border-box

img
  display: block
  max-height: 100vh
  max-width: 80vw

.fullScreenBtn
  position: fixed
  top: 0
  right: 0
  background: red
  z-index: 1

// .page
//   display: flex 
//   flex-direction: column
//   height: 100%
//   width: 100%
//   justify-content: center
//   align-items: center

.image-area
  width: 100%

.main-carousel
  // height: 300px
  // padding: 20px
  box-sizing: border-box
  // border: 1px solid green
  // width: 100%

.carousel-cell
  background: #222
  // width: 80%
  width: 100vw
  height: 100vh
  counter-increment: carousel-cell
  // for full-screen
  display: flex
  align-items: center
  justify-content: center

  // position: fixed
  // left: 0
  // top: 0
  // width: 100vw
  // height: 100vh
  // background: hsla(0, 0%, 0%, 0.9)
  // padding-bottom: 35px
  // z-index: 1

.is-fullscreen
  position: fixed
  left: 0
  top: 0
  width: 100vw
  height: 100vh
  background: hsla(0, 0%, 0%, 0.9)
  // padding-bottom: 35px
  z-index: 1

.message-area
  border: 1px solid pink
  position: absolute
  bottom: 0
  right: 0

</style>
