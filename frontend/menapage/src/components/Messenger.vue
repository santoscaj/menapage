<template lang="pug">
  //- transition( name="messenger-fade")
  .messenger(v-show="value" )
    .title( @click="stopShowing()" @touchstart.prevent="stopShowing()" @touch="stopShowing()") 
      p Talk to Berto anytime anywhere
      x-icon
    //- .wrapper
    .chat-log( ref="chat" @click="showEmoji=false")
      .message(v-for="message in messages" :class="{'my-message': activeUser.id == message.user.id }" :key="message.id") 
        img.avatar( v-if="showAvatar && message.user.alias =='Berto'" src="@/assets/faceicons/Berto/8.jpg" :alt="message.user.name.charAt(0)")
        img.avatar( v-if="showAvatar && message.user.alias =='Meni'" src="@/assets/faceicons/Meni/4.jpg" :alt="message.user.name.charAt(0)")
        .message-area
          .top-message
            p
              span.user {{message.user.alias}}:
              span {{message.content}}
          .bottom-message
            span.date {{message.datetime}}
    .input-chat
      picker.emoji-picker(
        v-show="showEmoji" 
        @select="selectEmoji" 
        @contextmenu.prevent=""
          :data="emojiIndex"
          :perLine="9"
          title="Berto loves meni"
          :showPreview="false"
          color="darkorange"
          set="facebook"
        )
        //- @touchstart.native="clickMe"
      textarea.input-text( 
        ref="textarea" 
        :draggable="false" 
        :disabled="messageIsSending" 
        v-model="input" 
        @keyup="keypressed" 
        @touchstart.stop="clickMe"
        @click="showEmoji=false")
      .btns-area
        button(
          @click="showEmoji=!showEmoji" 
          @touchstart.prevent="showEmoji=!showEmoji") 
          smile-icon
        button( @click="sendMessage()" @touchstart.prevent="sendMessage()")
          send-icon
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Prop, Vue , Watch} from 'vue-property-decorator'
import io from 'socket.io-client'
// @ts-ignore 
import {SendIcon, SmileIcon, XIcon} from 'vue-feather-icons'
//@ts-ignore
import { Picker , EmojiIndex } from 'emoji-mart-vue-fast'
//@ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'
let emojiIndex = new EmojiIndex(data)
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import {Message} from 'view-design'
import 'view-design/dist/styles/iview.css'
import store from '@/store'
let defaultUrl = axios.defaults.baseURL = process.env.VUE_APP_BACKEND
require('@/assets/faceicons/Berto/0.jpg')
@Component({components:{SendIcon, SmileIcon, XIcon, Picker }})
export default class Messenger extends Vue{
@Prop() value! : boolean
@Prop({default: defaultUrl}) url! : string

messages : any[] = []
input=''
emojiIndex = emojiIndex
showEmoji = false
showAvatar = true
// user : any = {}
messageIsSending = false

get userImage(){
  return {
    'Berto' : `@/assets/faceicons/Berto/${Math.floor( Math.random() * 9).toString().trim()}.jpg`,
    'Meni'  : `@/assets/faceicons/Meni/${Math.floor( Math.random()*9).toString().trim()}.jpg`
  }
}

get activeUser(){
  return store.user
}

get messagesLenght(){
  return this.messages.length
}

get messagingToken(){
  // @ts-ignore 
  return this.$firebase.token
}


// These functions are defined in lifecyclehook
updateMessagingToken(){}
updateUser(){}
sendSocketMessage = (data:any)=>{}

@Watch('messagingToken')
tokenUpdate(){this.updateMessagingToken()}

@Watch('activeUser')
userUpdate(){
  this.updateUser()}

@Watch('value')
async scrollToBottom(newVal : boolean, oldVal:boolean){
  await this.$nextTick()
  if(newVal){
    let element = (this.$refs.chat)
    if(element){
      // @ts-ignore 
      element.scrollTo(0, element.scrollHeight)
      this.focusOnTextArea()
    }
  }
}

@Watch('messagesLenght')
scrollOnNewInput(){
  this.scrollToBottom(true, true)
}

async focusOnTextArea(){
  await this.$nextTick()
  let element = (this.$refs.textarea as HTMLElement)
  if(element)
    setTimeout(()=>element.focus(), 500)
}

selectEmoji(data:any){
  this.input = this.input + data.native
  this.showEmoji = false
}

clickMe(event: any){
  try{
    event.target.click()
    event.target.focus()
  }catch(err){
    // console.error(err)
  }
}

stopShowing(){
  this.$emit('input', false)
}

async sendMessage(){
  this.focusOnTextArea()
  if(!this.input) return 
  this.sendSocketMessage({content:this.input, user_id: store.user.id})
  this.messageIsSending = true
} 

keypressed(e: any){
  if(e.keyCode==13 && !e.altKey && !e.shiftKey)
    this.sendMessage()
}


mounted(){
  // this.getUser()
  
  // let socket = io(this.url, {reconnection: false})
  let socket = io(this.url)

  socket.on('connect', ()=>{
    // @ts-ignore 
    socket.emit('firebasetoken', this.$firebase.token)
    socket.emit('user', this.activeUser)
  });
  socket.on('disconnect', ()=>{console.log('disconnected')});
  socket.on('history', ( data : any )=>{
    this.messages = data.map( (x:any)=>{
      let img = `@/assets/faceicons/Berto/0.jpg`
      let datetime = new Date('2020-07-17T22:37:45.234Z').toLocaleString("en-US", {timeZone: "Canada/Eastern"})
      return {...x, datetime, img}
  })});
  socket.on('newmessage', ( data : any )=>{
    let datetime = new Date('2020-07-17T22:37:45.234Z').toLocaleString("en-US", {timeZone: "Canada/Eastern"}) 
    this.messages.push({...data, datetime})
  })
  
  socket.on('errormessage', ()=>{
    // @ts-ignore 
    Message.error('there was an error with the message')
      this.messageIsSending = false
    });
  socket.on('successmessage', ()=>{
      this.input = ''
      this.messageIsSending = false
      this.focusOnTextArea()
    });
  socket.on('error', ( data : any )=>{console.error('error getting messages' + data)});

  this.sendSocketMessage = data =>{
    socket.emit('newmessage', data)
  }

  this.updateMessagingToken = ()=>{
    // @ts-ignore 
    socket.emit('firebasetoken', this.$firebase.token)
  }

  this.updateUser = ()=>{
    socket.emit('user', this.activeUser)
  }

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
  z-index: 2
  height: auto
  max-width: 100vw
  max-height: 100vh
  bottom: 0
  right: 0

.title
  font-family: 'Open Sans', cursive
  flex: 0 0 auto
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%
  height: var(--bar-height)
  font-size: 16px
  font-weight: 600
  text-align: center
  background: #ebb44d
  background: var(--primary-color)
  color: black
  color: white
  padding: 3px 10px
  border-radius:  var(--border-radius) var(--border-radius) 0 0
  border: 1px solid white
  &:hover
    color: white

.chat-log
  position: relative
  display: flex
  flex-direction: column
  align-items: flex-start
  // justify-content: flex-end
  // overflow-y: scroll
  flex: 1 1 auto
  right: 0
  bottom: 0
  // user-select: none
  width:  100%
  height: 500px
  overflow: auto
  font-weight: 500
  background: rgb(255,255,255,0.4)
  padding-bottom: 5px

.avatar
  width: 20px
  height: 20px
  border-radius: 50%
  margin: 0 5px

.message
  width: auto
  margin: 5px
  font-size: 14px
  line-height: 17px
  padding: 7px 12px
  background-image: linear-gradient(rgb(255,0,255, 0.1), rgb(255,0,255, 0.1))
  background: white
  border: 1px solid purple
  border: 1px solid var(--secondary-color)
  color: black
  margin-right: 60px
  border-radius: 0 10px 10px 10px 
  display: flex

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

.date
  font-size: 9px
  color: gray
  font-weight: 600
  padding: 1px

.user
  font-weight: 700
  padding-right: 5px

.top-message
  display: flex

// .bottom-message


.input-chat
  background: white
  position: relative
  flex: 0 0 auto
  height: calc(var(--bar-height) * 2)
  border-radius: 0 0 var(--border-radius) var(--border-radius)
  display: flex
  overflow: hidden
  width: 100%
  border: 1px solid gray
  overflow: visible
  
.input-text
  font-family: 'Comic Neue', cursive
  resize: none
  border-radius: 0 0 0 10px
  width: 100%
  border: none
  padding: 10px
  outline: none
  border: none
  &:focus, &:hover
    outline: none
    border: none

.btns-area
  height: 100%
  background: var(--primary-color)
  display: flex
  flex-direction: column
  justify-content: center
  // align-items: center
  border-radius: 5px
  overflow: hidden
  border-radius: 0 0 10px 0
  &>button, button:focus
    display: flex
    justify-content: center
    align-items: center
    background: white
    outline: none
    padding: 5px 10px
    font-size: 15px
    border: 1px solid var(--icon-border-no-hover)
    color: var(--icon-color-no-hover)
    background-color: var(--icon-background-no-hover)
    border-radius: 5px
    &:hover
      border: 1px solid var(--icon-border-hover)
      color: var(--icon-color-hover)
      background-color: var(--icon-background-hover)

.emoji-picker
  position: absolute
  bottom: 100%
  margin-bottom: 1px
  // z-index: 1

// .messenger-fade-enter-active, .messenger-fade-leave-active 
//   transition: opacity 0.4s

// .messenger-fade-enter, .messenger-fade-leave-to
//   opacity: 0

// .wrapper
//   display: flex
//   overflow-y: auto
//   flex-direction: column-reverse

@media (max-width: 450px)
  .messenger
    width: 100vw
    height: 100vh
    margin: 0
    bottom: 0
    right: 0
    z-index: 2
  
  .input-text, .btns-area
    border-radius: 0

  .title, .input-chat
    border-radius: 0

</style>

