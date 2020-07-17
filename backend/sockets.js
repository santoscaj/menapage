let { Message, User } = require('./db')
require('dotenv').config()
axios = require('axios')

activeSockets = []

let googleFirebaseApi = 'https://fcm.googleapis.com/fcm/send'

async function sendNotification(list, title, body){
    for(let destination of list){
      if(!destination) continue 
      await axios.post(googleFirebaseApi, 
        {
          to: destination,
          notification:{
            title,
            body,
            icon:'./img/icons/apple-touch-icon-152x152.png',
            click_action: 'https://gaminob.santosaj.com/'
          }
        } ,{
        headers:{
            Authorization: `key=${process.env.key}`,
            "Content-Type" : 'application/json'
            }
        })
      }
}


async function notifyMessage(messageSender, message){
  let body = message.content
  let sender = messageSender || {alias:'', name:'', id:''}
  let senderName = messageSender.alias || messageSender.name
  title = senderName ? `new message from ${senderName}` : 'new message'
  let list = activeSockets
                .filter(socket=>socket.user)
                .filter(socket=>socket.user.id!=sender.id)
                .map(socket => socket.firebaseToken)
  let uniqueList = Array.from(new Set(list))
  sendNotification(uniqueList, title, body)
}

function printAllUsers(){
  activeSockets.forEach(x=>console.log(x.user))
}

module.exports =  function(io){
    // console.log(Object.keys(io.sockets.connected))
    io.on('connection', async socket => { 
        console.log(`Connected socket ${socket.id}! active connections ${Object.keys(io.sockets.connected).length}`)
        activeSockets.push(socket)

        let lastMessage = {content:'', user_id:0, sent_at: new Date()}
        function messageIdDuplicate(message){
            let messageIsTheSame = message.content == lastMessage.content && message.user_id == lastMessage.user_id
            let timeDiff = 0
            if(messageIsTheSame)
                timeDiff = new Date().getTime() - lastMessage.sent_at.getTime()                

            if(messageIsTheSame && timeDiff <= 1000)
                return true
            else
                lastMessage = {content: message.content, user_id: message.user_id , sent_at: new Date()}

            return  false
        }

        try{
            let messages = await Message.findAll({include:[User]})
            socket.emit('history', messages)
        }catch(err){
            console.log(err)    
            socket.emit('error',err)
        }

        socket.on('user', user=>{
            // console.log('setting user')
            socket.user = user
            // printAllUsers()
        })

        socket.on('firebasetoken', function(data){
            // console.log('setting firebase ', data)
            socket.firebaseToken = data
            // setTimeout(()=>{
            //   sendNotification([data], 'testo\n berto\n2', 'this\nis\na\ntest')
            // }, 3000)
        })
        
        socket.on('disconnect', function(){
            let index = activeSockets.find(s=>s.id==socket.id)
            activeSockets.splice(index, 1)

            console.log(`Disconnecting ${socket.id}! active connections: ${Object.keys(io.sockets.connected).length}`)
            socket.disconnect()
            console.log(`Disconnecting ${socket.id}! active connections: ${Object.keys(io.sockets.connected).length}`)
        });
        
        socket.on('newmessage', async function(data){
            if(messageIdDuplicate(data, lastMessage))
                return

            try{
                let dbMessage = await Message.create({...data})
                let newMessage = await Message.findOne({where:{id:dbMessage.id}, include: User})
                io.emit('successmessage')
                io.emit('newmessage', newMessage)
                notifyMessage(socket.user, newMessage)
            }catch(err){
                socket.emit('errormessage', err)
                console.error(err)
            }
        })
        
    });
}