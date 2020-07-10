<template lang="pug">
transition( name="messenger-fade")
  .messenger(v-if="value")
    .title( @click="stopShowing()" @touchstart="stopShowing()" @touch="stopShowing()") 
      p this is the title
    .chat-log
      .message(v-for="message in messages" :class="{'my-message': mainUserRegex.test(message.user.alias)}") 
        span.user {{message.user.alias}}:
        span {{message.content}}
    .input-chat
      input(v-model="input")
      .btns-area
        button
        button
//- beautiful-chat(
//-       @touchstart="closeChat()" 
//-       :participants="participants"
//-       :titleImageUrl="titleImageUrl"
//-       :onMessageWasSent="onMessageWasSent"
//-       :messageList="messageList"
//-       :newMessagesCount="newMessagesCount"
//-       :isOpen="isChatOpen"
//-       :close="closeChat"
//-       :icons="icons"
//-       :open="openChat"
//-       :showEmoji="true"
//-       :showFile="true"
//-       :showEdition="true"
//-       :showDeletion="true"
//-       :showTypingIndicator="showTypingIndicator"
//-       :showLauncher="true"
//-       :showCloseButton="true"
//-       :colors="colors"
//-       :alwaysScrollToBottom="alwaysScrollToBottom"
//-       :messageStyling="messageStyling"
//-     )
    
</template>

<script lang="ts">
import { Component, Prop, Vue , Watch} from 'vue-property-decorator'
import io from 'socket.io-client'
// import CloseIcon from 'vue-beautiful-chat/src/assets/close-icon.png'
// import OpenIcon from 'vue-beautiful-chat/src/assets/logo-no-bg.svg'
// import FileIcon from 'vue-beautiful-chat/src/assets/file.svg'
// import CloseIconSvg from 'vue-beautiful-chat/src/assets/close.svg'

// interface Message {
//    type: string
//    author: string
//    data: { text: string } 
// }


@Component({components:{}})
export default class Collage extends Vue{

@Prop() value! : boolean
@Prop({default:"http://localhost:3000/"}) url! : string

messages = []
input=''
mainUserRegex = /meni/i
stopShowing(){
  this.$emit('input', false)
}

mounted(){
  let socket = io(this.url)
  socket.on('connect', ()=>{console.log('connected successfully')});
  socket.on('history', ( data : any )=>{this.messages = data});
  socket.on('error', ( data : any )=>{console.log('error getting messages' + data)});
}

// get CloseIcon(){
//   return CloseIcon
// }

// chat start

// sendMessage (text:string) {
//   if (text.length > 0) {
//     this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
//     this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
//   }
// }

// handleScrollToTop () {
//   // called when the user scrolls message list to top
//   // leverage pagination for loading another page of messages
// }
// handleOnType () {
//   console.log('Emit typing event')
// }

// editMessage(message: Message){

// }

// onMessageWasSent (message : Message) {
//   // called when the user sends a message
//   this.messageList = [ ...this.messageList, message ]
// }

// openChat () {
//       // called when the user clicks on the fab button to open the chat
//       this.isChatOpen = true
//       this.newMessagesCount = 0
// }

// closeChat () {
//     // called when the user clicks on the botton to close the chat
//     this.isChatOpen = false
//   }

//       icons = {
//         open:{
//           img: OpenIcon,
//           name: 'default',
//         },
//         close:{
//           img: CloseIcon,
//           name: 'default',
//         },
//         file:{
//           img: FileIcon,
//           name: 'default',
//         },
//         closeSvg:{
//           img: CloseIconSvg,
//           name: 'default',
//         },
//       }
//       participants = [
//         {
//           id: 'user1',
//           name: 'Matteo',
//           imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
//         },
//         {
//           id: 'user2',
//           name: 'Support',
//           imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
//         }
//       ]
//        // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
//       titleImageUrl =  'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
//       messageList =  [
//           { type: 'text', author: `me`, data: { text: `Say yes!` } },
//           { type: 'text', author: `user1`, data: { text: `No.` } }
//       ]
      
//       // the list of the messages to show, can be paginated and adjusted dynamically
//       newMessagesCount = 0
//       isChatOpen =  true  // to determine whether the chat window should be open or closed
//       showTypingIndicator =  '' // when set to a value matching the participant.id it shows the typing indicator for the specific user
//       colors = {
//         header: {
//           bg: '#4e8cff',
//           text: '#ffffff'
//         },
//         launcher: {
//           bg: '#4e8cff'
//         },
//         messageList: {
//           bg: '#ffffff'
//         },
//         sentMessage: {
//           bg: '#4e8cff',
//           text: '#ffffff'
//         },
//         receivedMessage: {
//           bg: '#eaeaea',
//           text: '#222222'
//         },
//         userInput: {
//           bg: '#f4f7f9',
//           text: '#565867'
//         }
//       }
//       // specifies the color scheme for the component
//       alwaysScrollToBottom =  false // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
//       messageStyling =  true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
// chat end

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  bottom: 0
  right: 0

.title
  flex: 0 0 auto
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: var(--bar-height)
  font-size: 16px
  font-weight: 600
  text-align: center
  background: var(--orange-color)
  color: black
  padding: 3px
  // border: 1px solid var(--orange-color)
  border-radius:  var(--border-radius) var(--border-radius) 0 0

.chat-log
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

.message
  width: auto
  margin: 5px
  // margin-bottom: 0
  font-size: 14px
  line-height: 17px
  padding: 7px 12px
  background: white
  background-image: linear-gradient(rgb(255,0,255, 0.1), rgb(255,0,255, 0.1))
  border: 1px solid purple
  color: black
  margin-right: 60px
  border-radius: 0 10px 10px 10px 

.my-message
  align-self: flex-end
  background: white
  border: 1px solid darkorange
  color: black
  margin: 5px
  // margin-bottom: 0
  margin-left: 60px
  border-radius: 10px 0 10px 10px 

.user
  font-weight: 700
  padding-right: 5px

.input-chat
  flex: 0 0 auto
  height: var(--bar-height)
  border-radius: 0 0 var(--border-radius) var(--border-radius)
  display: flex
  overflow: hidden
  width: 100%

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
    height: 45px

</style>

