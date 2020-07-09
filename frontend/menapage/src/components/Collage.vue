<template lang="pug">
.page(@mousedown="showCaption=true" @mouseup="showCaption=false")
  Carousel.carousel(
    :per-page="1"
    :loop="true" 
    :centerMode="true"
    :navigationEnabled="true"
    ) 
    Slide.carousel-item( v-for="foto in fotos" :loop="true"  )
      img( :id="foto.id" :src="'data:image/jpeg;charset=utf-8;base64,' + albumFotos[foto.id]" ) 
      transition( name="fade" )
        .caption-area( v-if="showCaption" )
          .caption-block.blur
          .caption-block( :id="'caption-'+foto.id" )
            .caption 
              p I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina
              p.date Jan 30, 2017
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
// import Flickity from 'flickity'
import axios from 'axios'
//@ts-ignore
import { Carousel, Slide } from 'vue-carousel'
import { Album, Foto, emptyAlbum, emptyFoto }  from '@/utils/Album'
let backendUrl = 'http://localhost:3000'

interface ImageSize {
  [index: number] : {width: string; height: string}
}

@Component({components:{Carousel,Slide}})
export default class Collage extends Vue {
  // fullScreen = false
  day         : number | null = null
  todaysAlbum : Album  = emptyAlbum()
  albumFotos  : Object = {} 
  imageSizes  : ImageSize = {}
  showCaption = false

  sizeOfPic(id: number){
      if(!this.imageSizes[id]) 
        return {width:'0',height: '0'}
      return {
        // @ts-ignore
        width: this.imageSizes[id].width+'px' || '0',
        // @ts-ignore
        height: this.imageSizes[id].height+'px' || '0'
        }
    }

  get fotos(){
    return this.todaysAlbum.fotos
  }

  onload(){
    console.log('l;ltu')
  }

  async setCaptions(){
    let captions = Array.from(document.querySelectorAll('.caption-block'))
    await this.$nextTick()
    document.querySelectorAll('.carousel-item>img').forEach(element=>{
      let id = element.id
      let caption = captions.find(c=>c.id=="caption-"+id)
      if(caption){
        console.log(element.clientHeight, element.clientWidth)
        // @ts-ignore 
        caption.style.width = element.clientWidth+'px'
        // @ts-ignore
        caption.style.height = element.clientHeight+'px'
      }else
        console.error('no caption found')
    })
  }

  updated(){
    this.setCaptions()
    // let captions = Array.from(document.querySelectorAll('.caption-block'))
    // document.querySelectorAll('.carousel-item>img').forEach(element=>{
    //   let id = element.id
    //   let caption = captions.find(c=>c.id=="caption-"+id)
    //   if(caption){
    //     console.log(element.clientHeight, element.clientWidth)
    //     // @ts-ignore 
    //     caption.style.width = element.clientWidth+'px'
    //     // @ts-ignore
    //     caption.style.height = element.clientHeight+'px'
    //   }else
    //     console.error('no caption found')
    // })    
  }

  async getFotos(fotos : Foto[]){
    for (let foto of fotos){
      try{
        let response = await axios.get(`${backendUrl}/fotos/${foto.id}`,{responseType: 'arraybuffer'})
        // @ts-ignore
        this.albumFotos = { ...this.albumFotos, [foto.id]: Buffer.from(response.data, 'binary').toString('base64') }
        // await this.$nextTick()
        // let img = this.$refs['image-'+foto.id]
        // console.log(document.querySelectorAll('.carousel-item'))
        // console.dir(this.$refs)
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
    this.day = 13
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

// .fullScreenBtn
//   position: fixed
//   top: 0
//   right: 0
//   background: red
//   z-index: 1

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
  width: 100%

.carousel-item
  display: flex
  background: white !important
  z-index: 1 !important
  justify-content: center
  background: #222
  // height: 100vh
  max-width: 100%
  max-height: 100%
  position: relative
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

.caption-area 
  font-family: 'Galada', cursive
  font-family: 'Dancing Script', cursive
  font-family: 'Yellowtail', cursive
  font-family: 'Grand Hotel', cursive
  font-family: 'La Belle Aurore', cursive
  font-family: 'Euphoria Script', cursive
  font-family: 'Great Vibes', cursive
  font-family: 'Satisfy', cursive
  font-family: 'Kaushan Script', cursive
  display: flex
  align-items: center
  justify-content: center
  font-size: 20px
  color: white
  position: absolute
  height: 100%
  width: 100%
  margin: auto
  text-align: center
  // width: calc(100% - 10px)
  // margin-bottom: 0
  // border: 1px solid cyan
  background-image: linear-gradient( rgb(0,0,0,0.4) 0%, rgb(0,0,0,0.5) 10%, rgb(0,0,0,0.6) 20%, rgb(0,0,0,0.7) 30%, rgb(0,0,0,0.8) 40%, rgb(0,0,0,0.8) 50%, rgb(0,0,0,0.8) 60%, rgb(0,0,0,0.7) 70%, rgb(0,0,0,0.6) 80%, rgb(0,0,0,0.5) 90%, rgb(0,0,0,0.4) 100%)
  z-index: 0


.caption-block
  top: 0
  // border: 1px solid red
  display: flex
  flex-direction: column
  justify-content: center
  // object-fit: cover
  

.blur
  filter: blur(5px)

.caption
  // background: white
  // background-image: linear-gradient(rgb(0,0,0,0.04), rgb(0,0,0,0.4))
  // background-color: rgb(0,0,0)
  // background-color: rgba(0,0,0, 0.4)
  font-size: 1.9vh
  // height: 100%
  line-height: 2.8vh
  color: salmon
  color: coral
  color: white
  bottom: 0
  padding: 15px
  padding-bottom: 50px

.fade-enter-active, .fade-leave-active 
  transition: opacity 3s

.fade-enter, .fade-leave-to
  opacity: 0

</style>

