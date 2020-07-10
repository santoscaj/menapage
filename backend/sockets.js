let { Message, User } = require('./db')

module.exports =  function(io){
    // console.log(Object.keys(io.sockets.connected))

    io.on('connection', async socket => { 
        console.log(`Connected socket ${socket.id}! active connections ${Object.keys(io.sockets.connected).length}`)
        try{
            let messages = await Message.findAll({include:[User]})
            socket.emit('history', messages)
        }catch(err){
            console.log(err)    
            socket.emit('error',err)
        }

        socket.on('disconnect', function(){
            console.log(`Disconnected socket ${socket.id}! active connections ${Object.keys(io.sockets.connected).length}`)            
        });

        socket.on('message', async function(data){
            console.log(data)
            return
            try{
                let newMessage = await Message.create({content:data.content, user_id: data.user_id})
                io.emit('message')
            }catch(err){
                socket.emit('error', err)
                console.error(err)
            }
        })
        
    });
}