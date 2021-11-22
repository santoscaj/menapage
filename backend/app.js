const express = require('express')
const app = express()
const router = require('./routes')
// const db = require('./db')
const cors = require('cors')
// const bodyParser = require('body-parser')


const server = require('http').createServer(app)
const io = require('socket.io')(server);
const socketConnections  = require('./sockets')(io)

let allowedOrigins = [
    'http://localhost','http://localhost:8080','http://localhost:8000', 
    'https://santosaj.com', 'https://gaminob.santosaj.com','http://gaminob.santosaj.com' ,
    'https://adminmenapage.santosaj.com','http://adminmenapage.santosaj.com'    
	]

app.use(express.json())
app.use(cors({origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}))

app.use(router)

server.listen(3000)