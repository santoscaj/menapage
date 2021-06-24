<template lang="pug">
.main-btns
  Messenger( v-model="showMessenger" @touchstart="touchToClick")
  Tooltip( content="logout" theme="dark" placement="top" )
    button.circle-btn.logout-btn( @click="logout()" ) 
      log-out-icon
  Tooltip( content="choose album" theme="dark" placement="top" )
    button.circle-btn.logout-btn( @click="chooseAlbum()" ) 
      grid-icon
  Tooltip( content="go to carousel" theme="dark" placement="top" )
    button.circle-btn.logout-btn( @click="carousel()" ) 
      image-icon
  .spacer
  Tooltip( v-if="!userIsGuest" content="open chat" theme="dark" placement="top" )
    button.circle-btn.messenger-btn( v-show="!rotate" @click="messengerOnOff()" @touch="messengerOnOff()" @touchstart="messengerOnOff()") 
      message-circle-icon
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator';
// @ts-ignore 
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpRightIcon, LogOutIcon, GridIcon, ImageIcon    } from 'vue-feather-icons'
import axios from 'axios'
import { Tooltip } from 'view-design';

//@ts-ignore
import {MessageCircleIcon} from 'vue-feather-icons'
//@ts-ignore
import { Carousel, Slide } from 'vue-carousel'
import { Album, Foto, emptyAlbum, emptyFoto }  from '@/utils/Album'
import  Messenger from '@/components/Messenger.vue'
import store from '@/store'

interface ImageSize {
  [index: number] : {width: string; height: string}
}

function getTimeLeftToNextDay(){
  let hoursLeft = 23 - ( new Date().getHours() )
  let minutesLeft = 59 - ( new Date().getMinutes() )
  return hoursLeft * 3600000 + minutesLeft * 60000
}

@Component({components:{ Tooltip, Carousel,Slide, Messenger, MessageCircleIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUpRightIcon, LogOutIcon, GridIcon, ImageIcon }})
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
  inTransition    = false

  get user(){
    return store.user
  }

  get userIsGuest(){
    return /visit/i.test(store.user.name)
  }

  touchToClick(e:any){
    e.target.click()
  }

  messengerOnOff(){
    this.showMessenger = !this.showMessenger
  }

  transitioning(value: boolean){
    // console.log(value)
  }

  goToManage(){
    this.$router.push({name:'Manage'})
  }

  logout(){
    localStorage.clear()
    store.logout()
    this.$router.push({name:'Login'})
  }
  carousel(){
    this.$router.push({name:'Home'})
  }
  chooseAlbum(){
    this.$router.push({name:'ManageHome'})
  }

  nextPage(){
    this.page = (this.page>=this.todaysAlbum.fotos.length - 1 ? 0 : this.page +1 )
  }

  prevPage(){
    this.page = (this.page<= 0 ? this.todaysAlbum.fotos.length -1  : this.page - 1)
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

  get windowIsSmall(){
    return this.windowSize <= 450
  }

  get rotate(){
    return (this.windowIsSmall && this.showMessenger )
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
        let response = await axios.get(`fotos/${foto.id}`,{responseType: 'arraybuffer'})
        // @ts-ignore
        this.albumFotos = { ...this.albumFotos, [foto.id]: Buffer.from(response.data, 'binary').toString('base64') }
      }catch(err){console.error(err)}
    }
  }

  @Watch('day')
  async getImagesForToday(){
    if(!this.day) return 
    try{
      let response = await axios.get(`album_of_the_day/${this.day}`)
      let album : Album = response.data
      await this.getFotos(album.fotos)
      this.todaysAlbum = album
    }catch(err){console.error(err)}
  }

  updateDate(){
    this.day = new Date().getDate()
  }

  created(){
    this.updateDate()
    setTimeout(()=>{
      // update current date and check what day it is once a day
      this.updateDate()
      setInterval(this.updateDate,86400000)
    },getTimeLeftToNextDay())
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
  --button-size: 50px
  --button-margin: 10px
  --orange-color: darkorange
  --purple-color: #D9BBF9
  --primary-color: #FFA400
  --secondary-orange: orange
  --secondary-color: #009FFD
  --matching-color-1: #FF5964
  --matching-color-2: #4E5283

  --icon-background-no-hover: #FFA400
  --icon-border-no-hover: #FFA400
  --icon-color-no-hover: white
  --icon-background-hover: white
  --icon-border-hover: #FFA400
  --icon-color-hover: black

.main-btns 
  flex: 0 0 auto
  box-sizing: border-box
  display: flex
  // width: 100vw
  height: 70px
  border: 1px solid red
  justify-content: space-between
  align-items: center
  padding: 0 30px
.spacer
  flex: 0 1 80%

.page
  display: flex 
  flex-direction: column
  height: 100vh
  width: 100vw
  justify-content: center
  align-items: center

.pagination-btns
  position: absolute
  width: 140px
  height: 100vh
  padding: 35px
  font-size: 50px
  z-index: 1 
  cursor: pointer
  &:hover
    color: silver

.left
  left: calc(0.1vw * 60 )
.right
  right: calc(0.1vw * 60 )

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
  font-size: 1.9vh
  line-height: 2.8vh
  color: salmon
  color: coral
  color: white
  bottom: 0
  padding: 15px
  padding-bottom: 50px


.circle-btn, .circle-btn:focus
  z-index: 3
  display: flex
  justify-content: center
  align-items: center
  width: var(--button-size)
  height: var(--button-size)
  border-radius: 50%
  outline: none
  // margin: var(--button-margin)
  // position: absolute
  color: var(--icon-color-no-hover)

.messenger-btn
  border: 1px solid var(--icon-border-no-hover)
  background-color: var(--icon-background-no-hover)
  color: var(--icon-color-no-hover)
  bottom: 0
  right: 0
  &:hover
    border: 1px solid var(--icon-border-hover)
    color: var(--icon-color-hover)
    background-color: var(--icon-background-hover)

.logout-btn
  bottom: 0
  left: 0
  border: 1px solid var(--icon-border-no-hover)
  background-color: var(--icon-background-no-hover)
  color: var(--icon-color-no-hover)
  &:hover
    border: 1px solid var(--icon-border-hover)
    color: var(--icon-color-hover)
    background-color: var(--icon-background-hover)

.manage-btn
  border: 1px solid var(--secondary-color)
  background-color: var(--secondary-color)
  color: var(--icon-color-no-hover)
  top: 0
  right: 0
  &:hover
    border: 1px solid var(--secondary-color)
    color: var(--icon-color-hover)
    background-color: var(--icon-background-hover)



.caption-fade-enter-active
  transition: opacity 4s

.caption-fade-leave-active 
  transition: opacity 1s  

.caption-fade-enter, .caption-fade-leave-to
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

@media (max-width: 750px)
  .left
    left: calc(0.05vw * 30 ) 
  .right
    right: calc(0.05vw * 30 ) 


</style>

