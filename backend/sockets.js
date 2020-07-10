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
            console.log(`Disconnecting ${socket.id}! active connections: ${Object.keys(io.sockets.connected).length}`)
            socket.disconnect()
            console.log(`Disconnecting ${socket.id}! active connections: ${Object.keys(io.sockets.connected).length}`)
        });

        socket.on('newmessage', async function(data){
            try{
                let dbMessage = await Message.create({...data})
                let newMessage = await Message.findOne({where:{id:dbMessage.id}, include: User})
                io.emit('successmessage')
                io.emit('newmessage', newMessage)
            }catch(err){
                socket.emit('errormessage', err)
                console.error(err)
            }
        })
        
    });
}