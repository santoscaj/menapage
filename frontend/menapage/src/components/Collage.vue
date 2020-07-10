<template lang="pug">
.page(
  @mousedown="showCaption=true" 
  @touchstart="showCaption=true" 
  @mouseup="showCaption=false"
  @touchend.prevent="showCaption=false"
  )
  Carousel.carousel(
    :per-page="1"
    :loop="true" 
    :centerMode="true"
    :navigationEnabled="true"
    :autoplay="rotate"
    :autoplayTimeout="20000"
    :paginationPadding="10"
    paginationColor="#EAF2E3"
    paginationActiveColor="#0D3B66"
    v-model="page"
    ) 
    Slide.carousel-item( v-for="foto in fotos" :loop="true"  )
      img( :id="foto.id" :src="'data:image/jpeg;charset=utf-8;base64,' + albumFotos[foto.id]" :class="{blur:showCaption}" ) 
      transition( name="fade" )
        .caption-area( v-show="showCaption" )
          .caption-block( :id="'caption-'+foto.id" )
            .caption 
              p I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina I love you cacahuate con pollo relleno de amor cuchi cuchi mandarina
              p.date Jan 30, 2017
  Messenger( v-model="showMessenger" )
  button.messenger-btn( v-show="!rotate" @click="messengerOnOff()" @touch="messengerOnOff()" @touchstart="messengerOnOff()") 
    message-circle-icon
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
import axios from 'axios'

//@ts-ignore
import {MessageCircleIcon} from 'vue-feather-icons'
//@ts-ignore
import { Carousel, Slide } from 'vue-carousel'
import { Album, Foto, emptyAlbum, emptyFoto }  from '@/utils/Album'
import  Messenger from '@/components/Messenger.vue'

let backendUrl = 'http://localhost:3000'

interface ImageSize {
  [index: number] : {width: string; height: string}
}

@Component({components:{Carousel,Slide, Messenger, MessageCircleIcon}})
export default class Collage extends Vue {
  // fullScreen = false
  day         : number | null = null
  todaysAlbum : Album  = emptyAlbum()
  albumFotos  : Object = {} 
  imageSizes  : ImageSize = {}
  showCaption     = false
  deviceIsMobile  = false
  showMessenger   = false
  page = 0
  windowSize = window.innerWidth

  messengerOnOff(){
    this.showMessenger = !this.showMessenger
  }

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

  get rotate(){
    return (this.windowSize < 450 && this.showMessenger )
  }

  onload(){
  }

  goToMessenger(){

  }

  async setCaptions(){
    let captions = Array.from(document.querySelectorAll('.caption-block'))
    await this.$nextTick()
    document.querySelectorAll('.carousel-item>img').forEach(element=>{
      let id = element.id
      let caption = captions.find(c=>c.id=="caption-"+id)
      if(caption){
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
  }

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
    this.day = 13
    // this.day = new Date().getDate()
    this.timeChecker()
  }

  mounted(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      this.deviceIsMobile=true
    }

    // @ts-ignore 
    window.onresize = ()=>{
      this.windowSize = window.innerWidth
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
*
  box-sizing: border-box
  --button-size: 40px
  --button-margin: 20px
  --orange-color: darkorange
  --purple-color: #D9BBF9
  --primary-color: #FFA400
  --secondary-color: #009FFD
  --matching-color-1: #FF5964
  --matching-color-2: #4E5283

// .fullScreenBtn
//   position: fixed
//   top: 0
//   right: 0
//   background: red
//   z-index: 1

.page
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
  flex-direction: column
  justify-content: center
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
  background-image: linear-gradient( rgb(0,0,0,0.2) 0%, rgb(0,0,0,0.3) 5%, rgb(0,0,0,0.4) 10%, rgb(0,0,0,0.5) 15%, rgb(0,0,0,0.6) 20%, rgb(0,0,0,0.7) 30%, rgb(0,0,0,0.8) 40%, rgb(0,0,0,0.8) 50%, rgb(0,0,0,0.8) 60%, rgb(0,0,0,0.7) 70%, rgb(0,0,0,0.6) 80%, rgb(0,0,0,0.6) 85%, rgb(0,0,0,0.4) 90%, rgb(0,0,0,0.3) 95%, rgb(0,0,0,0.2) 100%)
  z-index: 0


.caption-block
  top: 0
  // border: 1px solid red
  display: flex
  flex-direction: column
  justify-content: center
  // object-fit: cover
  

.blur
  // filter: blur(1px)
  transition: all 1.5s

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

.messenger-btn
  margin: var(--button-margin)
  border-radius: 50%
  border: 1px solid var(--orange-color)
  border: 1px solid var(--primary-color)
  color: var(--orange-color)
  color: var(--primary-color)
  
  background: white
  position: absolute
  width: var(--button-size)
  height: var(--button-size)
  bottom: 0
  right: 0
  outline: none
  &:focus
    outline: none
  &:hover
    background: var(--orange-color)
    background: var(--primary-color)
    color: white

.fade-enter-active
  transition: opacity 3s

.fade-leave-active 
  transition: opacity 1s  

.fade-enter, .fade-leave-to
  opacity: 0

::-webkit-scrollbar
  width: 6px

//  Track 
::-webkit-scrollbar-track 
  background: #f1f1f1
 
//  Handle 
::-webkit-scrollbar-thumb 
  border-radius: 5px
  background: #888

// Handle on hover 
::-webkit-scrollbar-thumb:hover
  background: #555

</style>

