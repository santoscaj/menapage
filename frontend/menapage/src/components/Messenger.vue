<template lang="pug">
transition( name="messenger-fade")
  .messenger(v-if="value")
    .title( @click="stopShowing()" @touchstart="stopShowing()" @touch="stopShowing()") 
      p this is the title
    .chat-log
      .message(v-for="message in messages" :class="{'my-message': mainUserRegex.test(message.user.alias)}") 
        span.user {{message.user.alias}}:
        span {{message.content}}
      picker.emoji-picker( 
        @select="selectEmoji" 
        @touchstart.native="touch"
          :data="emojiIndex"
          :perLine="9"
          title="Berto loves meni"
          :showPreview="false"
          color="#ae65c5"
          set="facebook"
        )
    .input-chat
      textarea(v-model="input" @keyup="keypressed" )
      .btns-area
        button
          smile-icon
        button
          send-icon

</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator'
import io from 'socket.io-client'
// @ts-ignore 
import {SendIcon, SmileIcon} from 'vue-feather-icons'
//@ts-ignore
import { Picker , EmojiIndex } from 'emoji-mart-vue-fast'
//@ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'
let emojiIndex = new EmojiIndex(data)
import 'emoji-mart-vue-fast/css/emoji-mart.css'


@Component({components:{SendIcon, SmileIcon, Picker }})
export default class Messenger extends Vue{

selectEmoji(data:any){
  console.dir(data.native)
}

@Prop() value! : boolean
@Prop({default:"http://localhost:3000/"}) url! : string

messages = []
input=''
mainUserRegex = /meni/i
emojiIndex = emojiIndex

touch(data: any){
  data.target.click()
}

stopShowing(){
  this.$emit('input', false)
}

keypressed(e: any){
  if(e.keyCode==13 && !e.altKey && !e.shiftKey)
    console.log('ENTER')
}

mounted(){
  let socket = io(this.url)
  socket.on('connect', ()=>{console.log('connected successfully')});
  socket.on('history', ( data : any )=>{this.messages = data});
  socket.on('error', ( data : any )=>{console.log('error getting messages' + data)});
}

}
</script>

<style scoped lang="sass">
* 
  box-sizing: border-box
  --bar-height: 40px
  --border-radius: 10px

.messenger
  font-family: 'Open Sans', cursive
  font-family: 'Comic Neue', cursive
  display: flex
  flex-direction: column
  margin: 20px
  margin-bottom: calc( 10px + var(--button-size) + var(--button-margin)  )
  position: absolute
  width: 380px
  height: auto
  max-width: 100vw
  max-height: 100vh
  border: 4px solid red
  bottom: 0
  right: 0

.title
  font-family: 'Open Sans', cursive
  flex: 0 0 auto
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: var(--bar-height)
  font-size: 16px
  font-weight: 600
  text-align: center
  // border: 2px solid var(--orange-color)
  background: #ebb44d
  background: var(--primary-color)
  color: black
  padding: 3px
  // border: 1px solid var(--orange-color)
  border-radius:  var(--border-radius) var(--border-radius) 0 0

.chat-log
  position: relative
  display: flex
  flex-direction: column
  align-items: flex-start
  flex: 1 1 auto
  right: 0
  bottom: 0
  user-select: none
  width:  100%
  height: 500px
  overflow: auto
  font-weight: 500
  // border: 1px solid red
  background: rgb(255,255,255,0.4)

.emoji-picker
  position: absolute
  bottom: 0

.message
  width: auto
  margin: 5px
  // margin-bottom: 0
  font-size: 14px
  line-height: 17px
  padding: 7px 12px
  background-image: linear-gradient(rgb(255,0,255, 0.1), rgb(255,0,255, 0.1))
  background: white
  border: 1px solid purple
  border: 1px solid var(--secondary-color)
  color: black
  // color: var(--secondary-color)
  margin-right: 60px
  border-radius: 0 10px 10px 10px 

.my-message
  align-self: flex-end
  background: white
  border: 1px solid darkorange
  border: 1px solid var(--primary-color)
  color: black
  margin: 5px
  // margin-bottom: 0
  margin-left: 60px
  border-radius: 10px 0 10px 10px 

.user
  font-weight: 700
  padding-right: 5px

.input-chat
  background: white
  flex: 0 0 auto
  height: calc(var(--bar-height) * 2)
  border-radius: 0 0 var(--border-radius) var(--border-radius)
  display: flex
  overflow: hidden
  width: 100%
  border: 1px solid gray
  &>input, &>textarea
    font-family: 'Comic Neue', cursive
    resize: none
    width: 100%
    border: none
    padding: 10px
    outline: none
    border: none
    &:focus, &:hover
      outline: none
      border: none

.messenger-fade-enter-active, .messenger-fade-leave-active 
  transition: opacity 0.4s

.messenger-fade-enter, .messenger-fade-leave-to
  opacity: 0

@media (max-width: 450px)
  .messenger
    width: 100vw
    height: 100vh
    margin: 0
    bottom: 0
    right: 0
    z-index: 1
  
  .title, .input-chat
    border-radius: 0
    // height: 45px



</style>

